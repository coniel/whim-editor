import {
  BraindropEditorPluginFactory,
  BraindropEditorPlugin,
  BraindropEditor,
  Transforms,
  Element,
} from '@sheets-editor/core';
import { Node, Element as SlateElement } from 'slate';

type TypeOption = 'any' | 'non-void' | 'void' | string;

export interface ForcedLayoutPluginOptions {
  layout?: TypeOption[];
  trailingElement?: TypeOption;
  defaultNonVoidType?: string;
  defaultVoidType?: string;
  defaultType?: string;
  maxRootElements?: number;
}

export const createForcedLayoutPlugin = (
  options: ForcedLayoutPluginOptions,
): BraindropEditorPluginFactory => (
  editor: BraindropEditor,
): BraindropEditorPlugin => {
  const {
    layout,
    trailingElement,
    defaultType,
    defaultNonVoidType,
    defaultVoidType,
    maxRootElements,
  } = options;
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length !== 0) {
      return normalizeNode([node, path]);
    }

    if (layout) {
      layout.forEach((type, index) => {
        if (editor.children.length < index + 1) {
          if (type === 'any' && defaultType) {
            editor.insertElement(defaultType, { at: path.concat(index) });
          } else if (type === 'non-void' && defaultNonVoidType) {
            editor.insertElement(defaultNonVoidType, {
              at: path.concat(index),
            });
          } else if (type === 'void' && defaultVoidType) {
            editor.insertElement(defaultVoidType, { at: path.concat(index) });
          } else {
            editor.insertElement(type, { at: path.concat(index) });
          }
        }
      });

      for (const [child, childPath] of Node.children(editor, path)) {
        const type = layout[childPath[0]];
        const node = Node.get(editor, childPath) as Element;

        if (type) {
          if (
            type === 'non-void' &&
            defaultNonVoidType &&
            editor.isVoid(node)
          ) {
            editor.turnIntoElement(defaultNonVoidType, node, { at: childPath });
          } else if (
            type === 'void' &&
            defaultVoidType &&
            !editor.isVoid(node)
          ) {
            editor.turnIntoElement(defaultVoidType, node, { at: childPath });
          } else if (
            SlateElement.isElement(child) &&
            !['void', 'non-void', 'any'].includes(type) &&
            child.type !== type
          ) {
            editor.turnIntoElement(type, node, { at: childPath });
          }
        }
      }
    }

    if (trailingElement) {
      const node = editor.children.slice(-1)[0] as Element;
      const childPath = [editor.children.length];
      if (
        trailingElement === 'non-void' &&
        defaultNonVoidType &&
        editor.isVoid(node)
      ) {
        editor.insertElement(defaultNonVoidType, { at: childPath });
      } else if (
        trailingElement === 'void' &&
        defaultVoidType &&
        !editor.isVoid(node)
      ) {
        editor.insertElement(defaultVoidType, { at: childPath });
      } else if (
        !['void', 'non-void', 'any'].includes(trailingElement) &&
        node.type !== trailingElement
      ) {
        editor.insertElement(trailingElement, { at: childPath });
      }
    }

    if (maxRootElements && editor.children.length > maxRootElements) {
      Transforms.removeNodes(editor, {
        at: {
          anchor: { path: [maxRootElements], offset: 0 },
          focus: { path: [editor.children.length - 1], offset: 0 },
        },
      });
    }

    return normalizeNode([node, path]);
  };

  return {};
};
