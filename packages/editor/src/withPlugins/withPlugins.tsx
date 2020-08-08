import React from 'react';
import isHotkey from 'is-hotkey';
import { v4 } from 'uuid';
import {
  Editable,
  ReactEditor,
  RenderElementProps as SlateReactRenderElementProps,
  RenderLeafProps,
} from 'slate-react';
import {
  Range,
  NodeEntry,
  Node,
  Element as SlateElement,
  Transforms,
  Editor,
} from 'slate';

import deserializeHtml from '../deserializeHtml';
import withMarkShortcuts from './withMarkShortcuts';
import withBlockShortcuts, { BlockShortcut } from './withBlockShortcuts';
import { EditableProps } from 'slate-react/dist/components/editable';

export interface Element extends SlateElement {
  type: string;
  id: string;
}

export interface RenderElementProps extends SlateReactRenderElementProps {
  attributes: {
    'data-slate-node': 'element';
    'data-block-id': string;
    'data-slate-inline'?: true;
    'data-slate-void'?: true;
    dir?: 'rtl';
    ref: any;
  };
  element: Element;
}

export interface Mark {
  [key: string]: boolean;
}

export interface DeserializeElementValue {
  type: string;
  [key: string]: unknown;
}

export type ElementDeserializers = Record<
  string,
  (el: HTMLElement) => DeserializeElementValue | undefined
>;

export type DeserializeMarkValue = Record<string, unknown> | undefined | false;

export type MarkDeserializer = (el: HTMLElement) => DeserializeMarkValue;

export type MarkDeserializers = Record<string, MarkDeserializer>;
export type CombinedMarkDeserializers = Record<string, MarkDeserializer[]>;

export interface MarkShortcut {
  start: string;
  end: string;
}

export interface SlashEditor extends ReactEditor {
  renderEditable: (props: EditableProps) => JSX.Element;
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  decorate: (entry: NodeEntry<Node>) => Range[];
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void | undefined;
  onDOMBeforeInput: (event: Event) => void;
}

export interface SlashPluginElementDescriptor {
  component: React.ReactType<RenderElementProps>;
  type: string;
  shortcuts?: string[];
  hotkeys?: string[];
  isVoid?: boolean;
  isInline?: boolean;
  insert?: (editor: SlashEditor) => void;
  turnInto?: (editor: SlashEditor, element: SlateElement) => void;
}

export interface SlashPluginLeafDescriptor {
  component: React.ReactType<RenderLeafProps>;
  mark: string;
  shortcuts?: MarkShortcut[];
  hotkeys?: string[];
}

export interface SlashPlugin {
  decorate?: (entry: NodeEntry<Node>) => Range[] | undefined;
  elementDeserializers?: ElementDeserializers;
  markDeserializers?: MarkDeserializers;
  renderElement?: (props: RenderElementProps) => JSX.Element | undefined;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void | undefined;
  onDOMBeforeInput?: (event: Event) => void;
  isVoid?: (element: SlateElement) => boolean;
  isInline?: (element: SlateElement) => boolean;
  elements?: SlashPluginElementDescriptor[];
  leaves?: SlashPluginLeafDescriptor[];
}

export type SlashPluginFactory = (editor: SlashEditor) => SlashPlugin;

type InsertEmptyNode = (editor?: SlashEditor) => void;
type ToggleMark = (editor?: ReactEditor) => void;
type HotkeyAction =
  | InsertEmptyNode
  | ToggleMark
  | SlashPluginElementDescriptor['insert'];

export type HotkeyActions = {
  [key: string]: HotkeyAction;
};

export interface MarkShortcutAction {
  start: string;
  end: string;
  mark: string;
}

export type MarkShortcutActions = {
  [key: string]: MarkShortcutAction[];
};

export const Element: React.FC<RenderElementProps> = ({
  attributes,
  children,
}) => <div {...attributes}>{children}</div>;

export const Leaf: React.FC<RenderLeafProps> = ({ attributes, children }) => (
  <span {...attributes}>{children}</span>
);

function renderElement(props: RenderElementProps): JSX.Element {
  return <Element {...props} />;
}

function renderLeaf(props: RenderLeafProps): JSX.Element {
  return <Leaf {...props} />;
}

function insertEmptyNode(editor: SlashEditor, type: string): InsertEmptyNode {
  return (): void =>
    Transforms.insertNodes(editor, {
      type,
      children: [{ text: '' }],
    });
}

function isMarkActive(editor: SlashEditor, mark: string): boolean {
  const marks = Editor.marks(editor);
  return marks ? marks[mark] === true : false;
}

function toggleMark(editor: SlashEditor, mark: string): ToggleMark {
  return (): void => {
    const isActive = isMarkActive(editor, mark);

    if (isActive) {
      Editor.removeMark(editor, mark);
    } else {
      Editor.addMark(editor, mark, true);
    }
  };
}

const withPlugins = (
  editor: ReactEditor,
  plugins: SlashPluginFactory[],
): SlashEditor => {
  const { apply } = editor;
  editor.onKeyDown = (): void => undefined;
  editor.renderElement = (props: RenderElementProps): JSX.Element =>
    renderElement(props);
  editor.renderLeaf = (props: RenderLeafProps): JSX.Element =>
    renderLeaf(props);
  editor.decorate = (): Range[] => [];
  editor.renderEditable = (props: EditableProps): React.ReactNode => (
    <Editable {...props} />
  );

  // Add ID to new nodes
  editor.apply = (operation): void => {
    if (operation.type === 'split_node' && operation.properties.type) {
      return apply({
        ...operation,
        properties: {
          ...operation.properties,
          id: v4(),
        },
      });
    }
    if (operation.type === 'insert_node') {
      const { node } = operation;
      if (SlateElement.isElement(node)) {
        return apply({
          ...operation,
          node: {
            ...node,
            id: v4(),
          },
        });
      }
    }

    apply(operation);
  };

  const hotkeyActions: HotkeyActions = {};
  const markShortcuts: MarkShortcutActions = {};
  const blockShortcuts: BlockShortcut[] = [];
  let elementDeserializers: ElementDeserializers = {};
  const markDeserializers: CombinedMarkDeserializers = {};

  let slashEditor = plugins.reduce(
    (slashEditor: SlashEditor, pluginFn): SlashEditor => {
      const {
        renderElement,
        renderLeaf,
        onKeyDown,
        onDOMBeforeInput,
        decorate,
      } = slashEditor;
      const plugin = pluginFn(slashEditor);

      if (plugin.elements) {
        plugin.elements.forEach(
          ({
            hotkeys,
            shortcuts,
            insert,
            turnInto,
            type,
            isVoid,
            isInline,
          }) => {
            if (hotkeys) {
              hotkeys.forEach((hotkey) => {
                hotkeyActions[hotkey] =
                  insert || insertEmptyNode(slashEditor, type);
              });
            }

            if (shortcuts) {
              shortcuts.forEach((shortcut) => {
                blockShortcuts.push({ trigger: shortcut, type, turnInto });
              });
            }

            if (isVoid) {
              const isVoidFn = editor.isVoid;
              editor.isVoid = (element): boolean =>
                element.type === type ? isVoid : isVoidFn(element);
            }

            if (isInline) {
              const isInlineFn = editor.isInline;
              editor.isInline = (element): boolean =>
                element.type === type ? isInline : isInlineFn(element);
            }
          },
        );
      }

      if (plugin.leaves) {
        plugin.leaves.forEach(({ hotkeys, shortcuts, mark }) => {
          if (hotkeys) {
            hotkeys.forEach((hotkey) => {
              hotkeyActions[hotkey] = toggleMark(slashEditor, mark);
            });
          }

          if (shortcuts) {
            shortcuts.forEach((shortcut) => {
              const trigger = shortcut.end.substr(-1);
              markShortcuts[trigger] = [
                ...(markShortcuts[trigger] || []),
                {
                  ...shortcut,
                  mark,
                },
              ];
            });
          }
        });
      }

      if (plugin.elementDeserializers) {
        elementDeserializers = {
          ...elementDeserializers,
          ...plugin.elementDeserializers,
        };
      }

      if (plugin.markDeserializers) {
        Object.keys(plugin.markDeserializers).forEach((tag) => {
          if (plugin.markDeserializers && plugin.markDeserializers[tag]) {
            if (!markDeserializers[tag]) {
              markDeserializers[tag] = [
                plugin.markDeserializers[tag] as MarkDeserializer,
              ];
            } else {
              markDeserializers[tag].push(plugin.markDeserializers[tag]);
            }
          }
        });
      }

      slashEditor.renderElement = (props): JSX.Element => {
        let element: JSX.Element | undefined;

        if (plugin.renderElement) {
          element = plugin.renderElement({
            ...props,
            attributes: {
              ...props.attributes,
              'data-block-id': props.element.id,
            },
          });
        }

        if (!element && plugin.elements) {
          plugin.elements.forEach((elementDescriptor) => {
            if (props.element.type === elementDescriptor.type) {
              const Element = elementDescriptor.component;

              element = <Element {...props} />;
            }
          });
        }

        return element || renderElement(props);
      };

      slashEditor.renderLeaf = (props): JSX.Element => {
        let { children } = props;

        if (plugin.renderLeaf) {
          children = plugin.renderLeaf(props);
        }

        if (plugin.leaves) {
          const { leaf } = props;

          plugin.leaves.forEach((leafDescriptor) => {
            if (leaf[leafDescriptor.mark]) {
              const Leaf = leafDescriptor.component;

              children = <Leaf {...props}>{children}</Leaf>;
            }
          });
        }

        return renderLeaf({ ...props, children });
      };

      slashEditor.onKeyDown = (event): void => {
        if (plugin.onKeyDown) {
          plugin.onKeyDown(event);
        }

        onKeyDown(event);
      };

      slashEditor.onDOMBeforeInput = (event): void => {
        if (plugin.onDOMBeforeInput) {
          plugin.onDOMBeforeInput(event);
        }

        if (onDOMBeforeInput) {
          onDOMBeforeInput(event);
        }
      };

      slashEditor.decorate = (props): Range[] => {
        if (plugin.decorate) {
          return plugin.decorate(props) || decorate(props);
        }

        return decorate(props);
      };

      if (typeof plugin.isVoid === 'function') {
        const { isVoid } = slashEditor;
        const pluginIsVoid = plugin.isVoid;

        slashEditor.isVoid = (element): boolean =>
          pluginIsVoid(element) || isVoid(element);
      }

      if (typeof plugin.isInline === 'function') {
        const { isInline } = slashEditor;
        const pluginIsInline = plugin.isInline;

        slashEditor.isInline = (element): boolean =>
          pluginIsInline(element) || isInline(element);
      }

      return slashEditor;
    },
    editor as SlashEditor,
  );

  const { onKeyDown } = slashEditor;

  slashEditor.onKeyDown = (event): void => {
    for (const hotkey in hotkeyActions) {
      if (isHotkey(hotkey, (event as unknown) as KeyboardEvent)) {
        event.preventDefault();
        const action = hotkeyActions[hotkey];
        if (action) {
          action(slashEditor);
        }
      }
    }

    onKeyDown(event);
  };

  const { insertData } = editor;
  editor.insertData = (data): void => {
    const html = data.getData('text/html');

    if (html) {
      const { body } = new DOMParser().parseFromString(html, 'text/html');
      const fragment: Node[] = deserializeHtml(
        body,
        elementDeserializers,
        markDeserializers,
      );

      if (!fragment.length) return;

      // replace the selected node type by the first node type
      if (fragment[0].type) {
        Transforms.setNodes(editor, { type: fragment[0].type });
      }

      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  slashEditor = withMarkShortcuts(slashEditor, markShortcuts);
  slashEditor = withBlockShortcuts(slashEditor, blockShortcuts);

  return slashEditor;
};

export default withPlugins;
