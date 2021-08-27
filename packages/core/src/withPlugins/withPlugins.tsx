/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import isHotkey from 'is-hotkey';
import { v4 as uuid } from 'uuid';
import {
  Editable,
  ReactEditor,
  RenderElementProps as BaseRenderElementProps,
  RenderLeafProps as SlateRenderLeafProps,
} from 'slate-react';
import {
  BaseRange,
  NodeEntry,
  Node,
  Element as SlateElement,
  Transforms,
  Editor,
  Path,
  BaseText,
} from 'slate';
import { getBlockAbove, isNodeType, isBlockAboveEmpty } from '../queries';
import { deserializeHtml } from '../deserializeHtml';
import { withBlockId } from './withBlockId';
import { withMarkShortcuts } from './withMarkShortcuts';
import { withBlockShortcuts, BlockShortcut } from './withBlockShortcuts';
import { BraindropEditor, EditableProps } from '../types/Slate.types';
import { generateElement } from '../utils';

type Element = SlateElement;

export type RenderLeafProps = SlateRenderLeafProps;
export type Text = BaseText;
export type Range = BaseRange;

export interface Mark {
  [key: string]: boolean;
}

export interface MarkedText extends BaseText {
  [key: string]: boolean | string;
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

interface InsertOptions {
  at?: Path;
}

interface TurnIntoOptions {
  at?: Path;
}

export type Insert = (editor: BraindropEditor, options?: InsertOptions) => void;
export type TurnInto = (
  editor: BraindropEditor,
  element: SlateElement,
  options?: TurnIntoOptions,
) => void;

export interface RenderElementProps<Elem = Element>
  extends Omit<BaseRenderElementProps, 'element'> {
  element: Elem;
}

export type ElementComponent<Elem> = React.ComponentType<
  RenderElementProps<Elem>
>;

export interface BraindropEditorPluginElementDescriptor<Elem> {
  component: ElementComponent<Elem>;
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

export interface BraindropEditorPluginLeafDescriptor {
  component: React.ComponentType<RenderLeafProps> | string;
  mark: string;
  shortcuts?: MarkShortcut[];
  hotkeys?: string[];
}

export interface BraindropEditorPlugin<ElementType = Element> {
  decorate?: (entry: NodeEntry<Node>) => BaseRange[] | undefined;
  elementDeserializers?: ElementDeserializers;
  markDeserializers?: MarkDeserializers;
  renderElement?: (props: RenderElementProps) => JSX.Element | undefined;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void | true;
  onDOMBeforeInput?: (event: Event) => void;
  isVoid?: (element: Node | Element) => boolean;
  isInline?: (element: Node) => boolean;
  elements?: BraindropEditorPluginElementDescriptor<ElementType>[];
  leaves?: BraindropEditorPluginLeafDescriptor[];
  insertData?: (data: DataTransfer) => void | boolean;
  insertText?: (text: string) => void;
}

export type BraindropEditorPluginFactory<ElementType = Element> = (
  editor: BraindropEditor,
) => BraindropEditorPlugin<ElementType>;

type InsertEmptyNode = (
  editor: BraindropEditor,
  options?: InsertOptions,
) => void;
type TurnIntoNode = (
  editor: BraindropEditor,
  options?: TurnIntoOptions,
) => void;
type ToggleMark = (editor?: BraindropEditor) => void;
interface HotkeyAction {
  action:
    | InsertEmptyNode
    | TurnIntoNode
    | InsertEmptyNode
    | ToggleMark
    | TurnInto
    | Insert;
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

const Element: React.FC<RenderElementProps> = ({ attributes, children }) => (
  <div {...attributes}>{children}</div>
);

export const Leaf: React.FC<RenderLeafProps> = ({ attributes, children }) => (
  <span {...attributes}>{children}</span>
);

function renderElement(props: RenderElementProps): JSX.Element {
  return <Element {...props} />;
}

function renderLeaf(props: RenderLeafProps): JSX.Element {
  return <Leaf {...props} />;
}

function insertEmptyNode(type: string, id: string): InsertEmptyNode {
  return (editor, options): void =>
    Transforms.insertNodes(
      editor,
      {
        type,
        id,
        children: [{ text: '' }],
      },
      options,
    );
}

function turnIntoNode(type: string): TurnIntoNode {
  return (editor: BraindropEditor, options?: TurnIntoOptions): void =>
    Transforms.setNodes(
      editor,
      {
        type,
      },
      options,
    );
}

function isMarkActive(editor: BraindropEditor, mark: string): boolean {
  const marks = Editor.marks(editor) as Record<string, boolean> | null;
  return marks ? marks[mark] === true : false;
}

function toggleMark(editor: BraindropEditor, mark: string): ToggleMark {
  return (): void => {
    const isActive = isMarkActive(editor, mark);

    if (isActive) {
      Editor.removeMark(editor, mark);
    } else {
      Editor.addMark(editor, mark, true);
    }
  };
}

export const withPlugins = (
  editor: BraindropEditor,
  pluginFactories: BraindropEditorPluginFactory[],
  blockIdGenerator: () => string = uuid,
): BraindropEditor => {
  const insertMap: Record<string, Insert | InsertEmptyNode> = {};
  const turnIntoMap: Record<string, TurnInto | TurnIntoNode> = {};
  const plugins: BraindropEditorPlugin[] = [];
  editor.generateBlockId = blockIdGenerator;
  editor.generateElement = (
    type: string,
    properties?: Record<string, unknown>,
  ) => generateElement(type, blockIdGenerator(), properties);
  editor.onKeyDown = (): void => undefined;
  editor.renderElement = (props: RenderElementProps): JSX.Element =>
    renderElement(props);
  editor.renderLeaf = (props: RenderLeafProps): JSX.Element =>
    renderLeaf(props);
  editor.decorate = (): BaseRange[] => [];
  editor.renderEditable = (props: EditableProps): React.ReactElement => (
    // TODO: solve this
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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

  let Editor = pluginFactories.reduce(
    (Editor: BraindropEditor, pluginFn): BraindropEditor => {
      const { renderLeaf, onDOMBeforeInput, decorate } = Editor;
      const plugin = pluginFn(Editor);
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
            insertMap[type] =
              insert || insertEmptyNode(type, blockIdGenerator());
            turnIntoMap[type] = turnInto || turnIntoNode(type);
            if (hotkeys) {
              hotkeys.forEach((hotkey) => {
                let action: HotkeyAction['action'] =
                  turnInto || turnIntoNode(type);

                if (isInline || isVoid) {
                  action = insert || insertEmptyNode(type, blockIdGenerator());
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
                action: toggleMark(Editor, mark),
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

      const { renderElement } = Editor;

      Editor.renderElement = (props): JSX.Element => {
        let element: JSX.Element | null | undefined;

        if (plugin.renderElement) {
          element = plugin.renderElement(props);
        }

        if (!element && plugin.elements) {
          plugin.elements.forEach((elementDescriptor) => {
            if (props.element.type === elementDescriptor.type) {
              const Element = elementDescriptor.component;

              if (Element) {
                element = <Element {...props} />;
              }
            }
          });
        }

        return element || renderElement(props);
      };

      Editor.renderLeaf = (props): JSX.Element => {
        let { children } = props;

        if (plugin.renderLeaf) {
          children = plugin.renderLeaf(props);
        }

        if (plugin.leaves) {
          const { leaf } = props;

          plugin.leaves.forEach((leafDescriptor) => {
            if ((leaf as MarkedText)[leafDescriptor.mark]) {
              const Leaf = leafDescriptor.component;

              children = <Leaf {...props}>{children}</Leaf>;
            }
          });
        }

        return renderLeaf({ ...props, children });
      };

      Editor.onDOMBeforeInput = (event): void => {
        if (plugin.onDOMBeforeInput) {
          plugin.onDOMBeforeInput(event);
        }

        if (onDOMBeforeInput) {
          onDOMBeforeInput(event);
        }
      };

      Editor.decorate = (props): BaseRange[] => {
        if (plugin.decorate) {
          return plugin.decorate(props) || decorate(props);
        }

        return decorate(props);
      };

      if (typeof plugin.isVoid === 'function') {
        const { isVoid } = Editor;
        const pluginIsVoid = plugin.isVoid;

        Editor.isVoid = (element): boolean =>
          pluginIsVoid(element) || isVoid(element);
      }

      if (typeof plugin.isInline === 'function') {
        const { isInline } = Editor;
        const pluginIsInline = plugin.isInline;

        Editor.isInline = (element): boolean =>
          pluginIsInline(element) || isInline(element);
      }

      return Editor;
    },
    editor as Editor,
  );

  editor.insertElement = (type: string, options?: InsertOptions) =>
    insertMap[type](Editor, options);
  editor.turnIntoElement = (
    type: string,
    element: Element,
    options?: TurnIntoOptions,
  ) => turnIntoMap[type](Editor, element, options);

  const { onKeyDown } = Editor;
  Editor.onKeyDown = (event): void => {
    for (const hotkey in hotkeyActions) {
      if (isHotkey(hotkey, (event as unknown) as KeyboardEvent)) {
        const entry = getBlockAbove(Editor);
        if (entry) {
          event.preventDefault();
          const hotkeyAction = hotkeyActions[hotkey];
          if (
            hotkeyAction &&
            hotkeyAction.action &&
            SlateElement.isElement(entry[0])
          ) {
            if (entry[0].type === hotkeyAction.type) {
              turnIntoNode('paragraph')(Editor);
            } else {
              hotkeyAction.action(Editor, entry[0]);
            }
          }
        }
      }
    }

    if (isHotkey('Enter', (event as unknown) as KeyboardEvent)) {
      const entry = getBlockAbove(Editor);

      if (
        isBlockAboveEmpty(editor) &&
        !isNodeType(entry, {
          allow: ['paragraph'],
        })
      ) {
        // Turn into default
        event.preventDefault();
        Transforms.setNodes(Editor, { type: 'paragraph' });
      } else if (
        // Break out
        isNodeType(entry, {
          exclude: [...sameTypeElements, ...softBreakElements],
          allow: breakOutElements,
        })
      ) {
        event.preventDefault();
        insertEmptyNode('paragraph', blockIdGenerator())(Editor);
      } else if (
        // Soft break
        isNodeType(entry, {
          exclude: [...sameTypeElements, ...breakOutElements],
          allow: softBreakElements,
        })
      ) {
        event.preventDefault();
        Editor.insertText('\n');
      } else {
        if (SlateElement.isElement(entry[0])) {
          event.preventDefault();
          insertMap[entry[0].type](editor);
        }
      }
    }

    if (isHotkey('Backspace', (event as unknown) as KeyboardEvent)) {
      if (isBlockAboveEmpty(Editor)) {
        const entry = getBlockAbove(Editor);
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
          Transforms.setNodes(Editor, { type: 'paragraph' });
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

  Editor.insertData = (data): void => {
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
      if (SlateElement.isElement(fragment[0]) && fragment[0].type) {
        Transforms.setNodes(Editor, { type: fragment[0].type });
      }

      Transforms.insertFragment(Editor, fragment);
      return;
    } else if (data.getData('text/plain')) {
      const fragment = data
        .getData('text/plain')
        .split('\n\n')
        .map((text) => ({
          type: 'paragraph',
          id: blockIdGenerator(),
          children: [{ text }],
        }));
      Transforms.insertFragment(Editor, fragment);
    }

    const text = data.getData('text/plain');

    if (text) {
      const lines = text.split(/\r\n|\n\r|\r\r|\n\n/);
      let split = false;

      for (const line of lines) {
        if (split) {
          Transforms.splitNodes(editor, { always: true });
        }

        editor.insertText(line);
        split = true;
      }
    }
  };

  plugins.forEach((plugin) => {
    const { onKeyDown, insertData } = Editor;
    if (plugin.insertData) {
      Editor.insertData = (data) => {
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
      Editor.onKeyDown = (event): void => {
        if (plugin.onKeyDown) {
          handledByPlugin = !!plugin.onKeyDown(event);
        }

        if (!handledByPlugin) {
          onKeyDown(event);
        }
      };
    }
  });

  Editor = withBlockId(Editor, blockIdGenerator);
  Editor = withMarkShortcuts(Editor, markShortcuts);
  Editor = withBlockShortcuts(Editor, blockShortcuts);

  return Editor;
};
