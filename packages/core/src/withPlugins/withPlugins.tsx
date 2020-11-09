import React from 'react';
import isHotkey from 'is-hotkey';
import { v4 } from 'uuid';
import {
  Editable,
  ReactEditor,
  RenderElementProps as SlateReactRenderElementProps,
  RenderLeafProps as SlateRenderLeafProps,
} from 'slate-react';
import {
  Range,
  NodeEntry,
  Node,
  Element as SlateElement,
  Transforms,
  Editor,
  Path,
} from 'slate';
import { EditableProps } from 'slate-react/dist/components/editable';
import { getBlockAbove, isNodeType, isBlockAboveEmpty } from '../queries';
import deserializeHtml from '../deserializeHtml';
import withMarkShortcuts from './withMarkShortcuts';
import withBlockShortcuts, { BlockShortcut } from './withBlockShortcuts';

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

export type RenderLeafProps = SlateRenderLeafProps;

export interface Mark {
  [key: string]: boolean;
}

export interface DeserializeElementValue {
  type: string;
  [key: string]: unknown;
}

export type ElementDeserializer = (
  el: HTMLElement,
  children: (Node | DeserializeElementValue | null)[],
  parent: HTMLElement | null,
) => DeserializeElementValue | DeserializeElementValue[] | void;

export type ElementDeserializers = Record<string, ElementDeserializer>;

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
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void | true;
  onDOMBeforeInput: (event: Event) => void;
  deleteElement: (element: Element) => void;
  insertElement: (type: string, options?: InsertOptions) => void;
  turnIntoElement: (
    type: string,
    element: Element,
    options?: TurnIntoOptions,
  ) => void;
}

export interface InsertOptions {
  at?: Path;
}

export interface TurnIntoOptions {
  at?: Path;
}

export type Insert = (editor: SlashEditor, options?: InsertOptions) => void;
export type TurnInto = (
  editor: SlashEditor,
  element: SlateElement,
  options?: TurnIntoOptions,
) => void;

export interface SlashPluginElementDescriptor {
  component: React.ReactType<RenderElementProps>;
  type: string;
  shortcuts?: string[];
  hotkeys?: string[];
  isVoid?: boolean;
  isInline?: boolean;
  insert?: Insert;
  turnInto?: TurnInto;
  returnBehaviour?: 'break-out' | 'same-type' | 'soft-break';
  backspaceOutBehaviour?: 'delete' | 'turn-into-default' | 'do-nothing';
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
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void | true;
  onDOMBeforeInput?: (event: Event) => void;
  isVoid?: (element: Node) => boolean;
  isInline?: (element: Node) => boolean;
  elements?: SlashPluginElementDescriptor[];
  leaves?: SlashPluginLeafDescriptor[];
  insertData?: (data: DataTransfer) => void | boolean;
  insertText?: (text: string) => void;
}

export type SlashPluginFactory = (editor: SlashEditor) => SlashPlugin;

type InsertEmptyNode = (editor: SlashEditor, options?: InsertOptions) => void;
type TurnIntoNode = (editor: SlashEditor, options?: TurnIntoOptions) => void;
type ToggleMark = (editor?: ReactEditor) => void;
interface HotkeyAction {
  action:
    | InsertEmptyNode
    | TurnIntoNode
    | InsertEmptyNode
    | ToggleMark
    | SlashPluginElementDescriptor['turnInto']
    | SlashPluginElementDescriptor['insert'];
  type: string;
}

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

function insertEmptyNode(type: string): InsertEmptyNode {
  return (editor, options): void =>
    Transforms.insertNodes(
      editor,
      {
        type,
        children: [{ text: '' }],
      },
      options,
    );
}

function turnIntoNode(type: string): TurnIntoNode {
  return (editor: SlashEditor, options?: TurnIntoOptions): void =>
    Transforms.setNodes(
      editor,
      {
        type,
      },
      options,
    );
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
  pluginFactories: SlashPluginFactory[],
): SlashEditor => {
  const insertMap: Record<string, Insert | InsertEmptyNode> = {};
  const turnIntoMap: Record<string, TurnInto | TurnIntoNode> = {};
  const { apply } = editor;
  const plugins: SlashPlugin[] = [];
  editor.onKeyDown = (): void => undefined;
  editor.renderElement = (props: RenderElementProps): JSX.Element =>
    renderElement(props);
  editor.renderLeaf = (props: RenderLeafProps): JSX.Element =>
    renderLeaf(props);
  editor.decorate = (): Range[] => [];
  editor.renderEditable = (props: EditableProps): React.ReactNode => (
    <Editable {...props} />
  );

  editor.deleteElement = (element: Element): void => {
    if (!SlateElement.isElement(element)) {
      return;
    }
    const path = ReactEditor.findPath(editor, element);
    const nextPath = Path.next(path);
    const hasPrevPath = path.slice(-1)[0] !== 0;
    let prevPath: Path | null = null;
    if (hasPrevPath) {
      prevPath = Path.previous(path);
    }
    const hasPrev = prevPath && Node.has(editor, prevPath);
    const hasNext = Node.has(editor, nextPath);

    const nodeProps = Object.keys(element).filter(
      (key) => !['id', 'children'].includes(key),
    );

    if (hasNext && prevPath && hasPrev) {
      // If there is a previous and next node, delete this node and
      //  move selection to end of previous node unless it's void
      Transforms.removeNodes(editor, { at: path, voids: true });
      if (!editor.isVoid(Node.get(editor, prevPath) as Element)) {
        setTimeout(() => {
          Transforms.select(editor, prevPath as Path);
          Transforms.collapse(editor, { edge: 'end' });
          ReactEditor.focus(editor);
        });
      }
    } else if (!hasNext) {
      // If there is no following node, turn this node into a default node
      // If the element is not void, remove its contents
      if (!editor.isVoid(element)) {
        Transforms.select(editor, path);
        editor.deleteFragment();
      }

      // Unset all custom node props
      Transforms.unsetNodes(editor, nodeProps, { at: path });
      Transforms.setNodes(editor, { type: 'paragraph' }, { at: path });
      setTimeout(() => {
        Transforms.select(editor, path);
        ReactEditor.focus(editor);
      });
    } else {
      // If the node has a next sibling, delete this node and
      // move selection to the start start of the next node
      // unless it's a void node
      Transforms.removeNodes(editor, { at: path });
      if (!editor.isVoid(Node.get(editor, nextPath) as Element)) {
        // Next node's path will become current path
        setTimeout(() => {
          Transforms.select(editor, path);
          Transforms.collapse(editor, { edge: 'start' });
          ReactEditor.focus(editor);
        });
      }
    }
  };

  // Add ID to new nodes
  editor.apply = (operation): void => {
    // console.log(operation);

    if (['insert_text', 'set_node', 'remove_text'].includes(operation.type)) {
      const applied = apply(operation);
      // setTimeout(() => {
      //   console.log('--- update ---');
      //   console.log(getBlockAbove(editor)[0]);
      // });

      return applied;
    }
    if (
      operation.type === 'merge_node' &&
      !operation.properties.isInline &&
      operation.properties.type
    ) {
      // console.log('deleted block (merge)', operation);
    }
    if (operation.type === 'remove_node' && !operation.node.isInline) {
      // console.log('deleted block (remove)', operation);
    }
    if (
      operation.type === 'split_node' &&
      !operation.properties.isInline &&
      operation.properties.type
    ) {
      // console.log('split block', operation);
      setTimeout(() => {
        // console.log('created_block', getBlockAbove(editor)[0]);
      });
    }
    if (operation.type === 'insert_node' && !operation.node.isInline) {
      // console.log('inserted block', operation);
    }
    if (operation.type === 'split_node' && operation.properties.type) {
      apply({
        ...operation,
        properties: {
          ...operation.properties,
          id: v4(),
        },
      });
      // setTimeout(() => {
      //   console.log('--- split_node ---');
      //   console.log(getBlockAbove(editor)[0]);
      // });
      return;
    }
    if (operation.type === 'insert_node') {
      const { node } = operation;
      if (SlateElement.isElement(node)) {
        apply({
          ...operation,
          node: {
            ...node,
            id: v4(),
          },
        });
        // setTimeout(() => {
        //   console.log('--- insert_node ---');
        //   console.log(getBlockAbove(editor)[0]);
        // });
        return;
      }
    }

    apply(operation);
  };

  const hotkeyActions: HotkeyActions = {};
  const markShortcuts: MarkShortcutActions = {};
  const blockShortcuts: BlockShortcut[] = [];
  const breakOutElements: string[] = ['paragraph'];
  const sameTypeElements: string[] = [];
  const softBreakElements: string[] = [];
  const backspaceOutBehaviours = {
    delete: ['paragraph'] as string[],
    'turn-into-default': [] as string[],
    'do-nothing': [] as string[],
  };
  let elementDeserializers: ElementDeserializers[] = [];
  const markDeserializers: CombinedMarkDeserializers = {};

  let slashEditor = pluginFactories.reduce(
    (slashEditor: SlashEditor, pluginFn): SlashEditor => {
      const {
        renderElement,
        renderLeaf,
        onDOMBeforeInput,
        decorate,
      } = slashEditor;
      const plugin = pluginFn(slashEditor);
      plugins.push(plugin);

      if (plugin.elements) {
        plugin.elements.forEach(
          ({
            hotkeys,
            shortcuts,
            turnInto,
            insert,
            type,
            isVoid,
            isInline,
            returnBehaviour,
            backspaceOutBehaviour = 'turn-into-default',
          }) => {
            insertMap[type] = insert || insertEmptyNode(type);
            turnIntoMap[type] = turnInto || turnIntoNode(type);
            if (hotkeys) {
              hotkeys.forEach((hotkey) => {
                let action: HotkeyAction['action'] =
                  turnInto || turnIntoNode(type);

                if (isInline || isVoid) {
                  action = insert || insertEmptyNode(type);
                }

                hotkeyActions[hotkey] = {
                  type,
                  action,
                };
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

            if (returnBehaviour === 'same-type') {
              sameTypeElements.push(type);
            } else if (returnBehaviour === 'soft-break') {
              softBreakElements.push(type);
            } else {
              breakOutElements.push(type);
            }

            backspaceOutBehaviours[backspaceOutBehaviour].push(type);
          },
        );
      }

      if (plugin.leaves) {
        plugin.leaves.forEach(({ hotkeys, shortcuts, mark }) => {
          if (hotkeys) {
            hotkeys.forEach((hotkey) => {
              hotkeyActions[hotkey] = {
                type: mark,
                action: toggleMark(slashEditor, mark),
              };
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
        elementDeserializers = [
          ...elementDeserializers,
          plugin.elementDeserializers,
        ];
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

  editor.insertElement = (type: string, options?: InsertOptions) =>
    insertMap[type](slashEditor, options);
  editor.turnIntoElement = (
    type: string,
    element: Element,
    options?: TurnIntoOptions,
  ) => turnIntoMap[type](slashEditor, element, options);

  const { onKeyDown } = slashEditor;
  slashEditor.onKeyDown = (event): void => {
    for (const hotkey in hotkeyActions) {
      if (isHotkey(hotkey, (event as unknown) as KeyboardEvent)) {
        const entry = getBlockAbove(slashEditor);
        if (entry) {
          event.preventDefault();
          const hotkeyAction = hotkeyActions[hotkey];
          if (hotkeyAction && hotkeyAction.action) {
            if (entry[0].type === hotkeyAction.type) {
              turnIntoNode('paragraph')(slashEditor);
            } else {
              hotkeyAction.action(slashEditor, entry[0]);
            }
          }
        }
      }
    }

    if (isHotkey('Enter', (event as unknown) as KeyboardEvent)) {
      const entry = getBlockAbove(slashEditor);

      if (
        isBlockAboveEmpty(editor) &&
        !isNodeType(entry, {
          allow: ['paragraph'],
        })
      ) {
        // Turn into default
        event.preventDefault();
        Transforms.setNodes(slashEditor, { type: 'paragraph' });
      } else if (
        // Break out
        isNodeType(entry, {
          exclude: [...sameTypeElements, ...softBreakElements],
          allow: breakOutElements,
        })
      ) {
        event.preventDefault();
        insertEmptyNode('paragraph')(slashEditor);
      } else if (
        // Soft break
        isNodeType(entry, {
          exclude: [...sameTypeElements, ...breakOutElements],
          allow: softBreakElements,
        })
      ) {
        event.preventDefault();
        slashEditor.insertText('\n');
      }
    }

    if (isHotkey('Backspace', (event as unknown) as KeyboardEvent)) {
      if (isBlockAboveEmpty(slashEditor)) {
        const entry = getBlockAbove(slashEditor);
        if (
          isNodeType(entry, {
            exclude: [
              ...backspaceOutBehaviours.delete,
              ...backspaceOutBehaviours['do-nothing'],
            ],
            allow: backspaceOutBehaviours['turn-into-default'],
          })
        ) {
          event.preventDefault();
          Transforms.setNodes(slashEditor, { type: 'paragraph' });
        } else if (
          isNodeType(entry, {
            exclude: [
              ...backspaceOutBehaviours['turn-into-default'],
              ...backspaceOutBehaviours.delete,
            ],
            allow: backspaceOutBehaviours['do-nothing'],
          })
        ) {
          event.preventDefault();
        }
      }
    }

    onKeyDown(event);
  };

  // const { insertData } = slashEditor;
  slashEditor.insertData = (data): void => {
    const html = data.getData('text/html');

    if (html) {
      const { body } = new DOMParser().parseFromString(html, 'text/html');
      const fragment: Node[] = deserializeHtml(
        body,
        null,
        elementDeserializers,
        markDeserializers,
      );

      if (!fragment.length) return;

      // replace the selected node type by the first node type
      if (fragment[0].type) {
        Transforms.setNodes(slashEditor, { type: fragment[0].type });
      }

      Transforms.insertFragment(slashEditor, fragment);
      return;
    } else if (data.getData('text/plain')) {
      const fragment = data
        .getData('text/plain')
        .split('\n\n')
        .map((text) => ({ type: 'paragraph', children: [{ text }] }));
      Transforms.insertFragment(slashEditor, fragment);
    }

    // const fragment = data.getData('application/x-slate-fragment');

    // if (fragment) {
    //   const decoded = decodeURIComponent(window.atob(fragment));
    //   const parsed = JSON.parse(decoded) as Node[];
    //   editor.insertFragment(parsed);
    //   return;
    // }

    // const text = data.getData('text/plain');

    // if (text) {
    //   const lines = text.split(/\r\n|\n\r|\r\r|\n\n/);
    //   let split = false;

    //   for (const line of lines) {
    //     if (split) {
    //       Transforms.splitNodes(editor, { always: true });
    //     }

    //     editor.insertText(line);
    //     split = true;
    //   }
    // }
  };

  plugins.forEach((plugin) => {
    const { onKeyDown, insertData } = slashEditor;
    if (plugin.insertData) {
      slashEditor.insertData = (data) => {
        let handled;
        if (plugin.insertData) {
          handled = plugin.insertData(data);
        }

        if (!handled) {
          insertData(data);
        }
      };
    }

    let handledByPlugin = false;
    if (plugin.onKeyDown) {
      slashEditor.onKeyDown = (event): void => {
        if (plugin.onKeyDown) {
          handledByPlugin = !!plugin.onKeyDown(event);
        }

        if (!handledByPlugin) {
          onKeyDown(event);
        }
      };
    }
  });

  slashEditor = withMarkShortcuts(slashEditor, markShortcuts);
  slashEditor = withBlockShortcuts(slashEditor, blockShortcuts);

  return slashEditor;
};

export default withPlugins;
