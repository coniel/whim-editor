import React from 'react';
import {
  SlashPluginFactory,
  SlashPlugin,
  SlashPluginElementDescriptor,
  SlashEditor,
} from '@sheets-editor/core';
import { Element, Transforms, Node, Path } from 'slate';
import ElementOrderedList from './ElementOrderedList';

export type OrderedListPluginOptions = Partial<
  Pick<
    SlashPluginElementDescriptor,
    | 'type'
    | 'shortcuts'
    | 'component'
    | 'hotkeys'
    | 'insert'
    | 'turnInto'
    | 'returnBehaviour'
  >
>;

function normalizeNumberedListNode(
  editor: SlashEditor,
  node: Node,
  path: Path,
  type: string,
): void {
  let number = 1;

  if (path[path.length - 1] !== 0) {
    let previousNodePath = [path[0] - 1];

    if (path.length > 1) {
      previousNodePath = [...path.slice(0, -1), path[path.length - 1] - 1];
    }

    if (Node.has(editor, previousNodePath)) {
      const previousNode = Node.get(editor, previousNodePath);
      if (previousNode.type === type) {
        number = ((previousNode.number as number) || 1) + 1;
      }
    }
  }

  if (node.number !== number) {
    Transforms.setNodes(editor, { number }, { at: path });
  }
}

function normalizeNumberedList(
  editor: SlashEditor,
  node: Node,
  path: Path,
  type: string,
): void {
  if (path.length) {
    let nextNodePath = [path[0] + 1];

    if (path.length > 1) {
      nextNodePath = [...path.slice(0, -1), path[path.length - 1] + 1];
    }

    if (Node.has(editor, nextNodePath)) {
      let nextNode: Node | null = Node.get(editor, nextNodePath);
      while (nextNode && nextNode.type === type) {
        normalizeNumberedListNode(editor, nextNode, nextNodePath, type);
        nextNodePath = [
          ...nextNodePath.slice(0, -1),
          nextNodePath[nextNodePath.length - 1] + 1,
        ];
        if (Node.has(editor, nextNodePath)) {
          nextNode = Node.get(editor, nextNodePath);
        } else {
          nextNode = null;
        }
      }
    }
  }
}

const OrderedListPlugin = (
  options: OrderedListPluginOptions = {},
): SlashPluginFactory => (editor): SlashPlugin => {
  const type = options.type || 'ol';
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry): void => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === type) {
      normalizeNumberedListNode(editor, node, path, type);
    }

    normalizeNumberedList(editor, node, path, type);

    return normalizeNode(entry);
  };
  return {
    elements: [
      {
        type,
        shortcuts: ['1) ', '1. '],
        component: (props): React.ReactElement => (
          <ElementOrderedList {...props} editor={editor} />
        ),
        returnBehaviour: 'same-type',
        ...options,
      },
    ],
  };
};

export default OrderedListPlugin;
