import {
  BraindropEditorPluginFactory,
  BraindropEditorPlugin,
  BraindropEditor,
  getBlockAbove,
  Element,
} from '@braindrop-editor/core';
import { Path, NodeEntry, Node, Element as SlateElement } from 'slate';

export type BlockEntry<BlockType extends Element = Element> = NodeEntry<
  BlockType
>;

export interface BlockApiPluginOptions<BlockType extends Element> {
  onUpdateBlock?: (block: BlockEntry<BlockType>) => void;
  onDeleteBlock?: (id: string, parent: BlockEntry<BlockType>) => void;
  onCreateBlock?: (
    block: BlockEntry<BlockType>,
    parent: BlockEntry<BlockType>,
  ) => void;
  onMoveBlock?: (
    fromPath: Path,
    toPath: Path,
    block: BlockEntry<BlockType>,
    fromParent: BlockEntry<BlockType>,
    toParent: BlockEntry<BlockType>,
  ) => void;
}

export const createBlockApiPlugin = <BlockType extends Element = Element>({
  onCreateBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
}: BlockApiPluginOptions<BlockType>): BraindropEditorPluginFactory => (
  editor: BraindropEditor,
): BraindropEditorPlugin => {
  const { apply } = editor;

  type Entry = BlockEntry<BlockType>;

  editor.apply = (operation): void => {
    if (operation.type === 'move_node' && onUpdateBlock) {
      setTimeout(() => {
        if (onMoveBlock) {
          const block =
            Node.has(editor, operation.newPath) &&
            Node.get(editor, operation.newPath);

          if (
            block &&
            SlateElement.isElement(block) &&
            !editor.isInline(block)
          ) {
            const fromParent = getBlockAbove(editor, {
              at: operation.path,
            });
            const toParent = getBlockAbove(editor, {
              at: operation.newPath,
            });
            onMoveBlock(
              operation.path,
              operation.newPath,
              [block as BlockType, operation.newPath],
              fromParent as Entry,
              toParent as Entry,
            );
          }
        }
      });
    }

    if (operation.type === 'insert_text' || operation.type === 'remove_text') {
      apply(operation);
      if (onUpdateBlock) {
        const block = getBlockAbove(editor, { at: operation.path }) as Entry;
        setTimeout(() => {
          if (block) {
            onUpdateBlock(block);
          }
        });
      }

      return;
    }

    if (operation.type === 'set_node') {
      apply(operation);
      if (onUpdateBlock) {
        const node = Node.get(editor, operation.path) as BlockType;
        if (editor.isInline(node)) {
          setTimeout(() => {
            const parent = getBlockAbove(editor, {
              at: operation.path,
            }) as Entry;
            if (parent) {
              onUpdateBlock(parent);
            }
          });
        } else {
          setTimeout(() => {
            if (parent) {
              onUpdateBlock([node, operation.path]);
            }
          });
        }
      }

      return;
    }

    if (
      operation.type === 'merge_node' &&
      !editor.isInline(operation.properties as BlockType) &&
      (operation.properties as BlockType).type
    ) {
      const parent = getBlockAbove(editor, {
        at: operation.path,
      }) as Entry;
      setTimeout(() => {
        if (onUpdateBlock) {
          const mergedIntoPath = Path.previous(operation.path);
          const mergedIntoBlock = Node.get(editor, mergedIntoPath) as BlockType;
          if (mergedIntoBlock && !editor.isInline(mergedIntoBlock)) {
            onUpdateBlock([mergedIntoBlock, mergedIntoPath]);
          }
        }
        if (
          onDeleteBlock &&
          typeof (operation.properties as BlockType).id === 'string' &&
          !editor.isInline(operation.properties as BlockType)
        ) {
          onDeleteBlock(
            (operation.properties as BlockType).id as string,
            parent,
          );
        }
      });
    }
    if (
      operation.type === 'remove_node' &&
      SlateElement.isElement(operation.node) &&
      !editor.isInline(operation.node) &&
      operation.node.type
    ) {
      const parent = getBlockAbove(editor, {
        at: operation.path,
      }) as Entry;

      setTimeout(() => {
        if (
          onDeleteBlock &&
          SlateElement.isElement(operation.node) &&
          typeof operation.node.id === 'string'
        ) {
          onDeleteBlock(operation.node.id, parent);
        }
      });
    }
    if (
      operation.type === 'split_node' &&
      !editor.isInline(operation.properties as BlockType) &&
      (operation.properties as BlockType).type
    ) {
      apply(operation);

      setTimeout(() => {
        const updatedBlock = Node.get(editor, operation.path) as BlockType;
        if (onUpdateBlock && updatedBlock) {
          onUpdateBlock([updatedBlock, operation.path]);
        }

        const newBlockPath = Path.next(operation.path);
        const newBlock = Node.get(editor, newBlockPath) as BlockType;
        if (onCreateBlock && newBlock) {
          const parent = getBlockAbove(editor, {
            at: operation.path,
          }) as Entry;
          onCreateBlock([newBlock, newBlockPath], parent);
        }
      });

      return;
    }
    if (operation.type === 'insert_node') {
      apply(operation);
      if (
        !SlateElement.isElement(operation.node) ||
        editor.isInline(operation.node) ||
        !operation.node.type
      ) {
        if (onUpdateBlock) {
          const block = getBlockAbove(editor, {
            at: operation.path,
          }) as Entry;
          setTimeout(() => {
            if (block) {
              onUpdateBlock(block);
            }
          });
          return;
        }
      } else if (onCreateBlock) {
        setTimeout(() => {
          if (operation.path.length > 1 && onUpdateBlock) {
            const block = Node.get(
              editor,
              operation.path.slice(0, -1),
            ) as BlockType;
            if (block) {
              onUpdateBlock([block, operation.path.slice(0, -1)]);
            }
          }
          const parent = getBlockAbove(editor, {
            at: operation.path,
          }) as Entry;
          onCreateBlock([operation.node as BlockType, operation.path], parent);
        });
        return;
      }

      return;
    }

    apply(operation);
  };

  return {};
};
