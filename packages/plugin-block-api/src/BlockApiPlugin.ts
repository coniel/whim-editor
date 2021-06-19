import {
  SlashPluginFactory,
  SlashPlugin,
  BraindropEditor,
  getBlockAbove,
} from '@sheets-editor/core';
import { Path, NodeEntry, Node, Element as SlateElement } from 'slate';
import { ElementWithId } from '@sheets-editor/plugin-block-id';

export type BlockEntry = NodeEntry<ElementWithId>;

export interface BlockApiPluginOptions {
  onUpdateBlock?: (block: BlockEntry) => void;
  onDeleteBlock?: (id: string, parent: BlockEntry) => void;
  onCreateBlock?: (block: BlockEntry, parent: BlockEntry) => void;
  onMoveBlock?: (
    fromPath: Path,
    toPath: Path,
    block: BlockEntry,
    fromParent: BlockEntry,
    toParent: BlockEntry,
  ) => void;
}

const BlockApiPlugin = ({
  onCreateBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
}: BlockApiPluginOptions): SlashPluginFactory => (
  editor: BraindropEditor,
): SlashPlugin => {
  const { apply } = editor;

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
            }) as BlockEntry;
            const toParent = getBlockAbove(editor, {
              at: operation.newPath,
            }) as BlockEntry;
            onMoveBlock(
              operation.path,
              operation.newPath,
              [block as ElementWithId, operation.newPath],
              fromParent,
              toParent,
            );
          }
        }
      });
    }

    if (['insert_text', 'set_node', 'remove_text'].includes(operation.type)) {
      apply(operation);
      if (onUpdateBlock) {
        setTimeout(() => {
          const block = getBlockAbove(editor) as BlockEntry;
          if (block) {
            onUpdateBlock(block);
          }
        });
      }

      return;
    }
    if (
      operation.type === 'merge_node' &&
      !editor.isInline(operation.properties as ElementWithId) &&
      (operation.properties as ElementWithId).type
    ) {
      setTimeout(() => {
        if (onUpdateBlock) {
          const mergedIntoPath = Path.previous(operation.path);
          const mergedIntoBlock = Node.get(
            editor,
            mergedIntoPath,
          ) as ElementWithId;
          if (mergedIntoBlock && !editor.isInline(mergedIntoBlock)) {
            onUpdateBlock([mergedIntoBlock, mergedIntoPath]);
          }
        }
        if (
          onDeleteBlock &&
          typeof (operation.properties as ElementWithId).id === 'string' &&
          !editor.isInline(operation.properties as ElementWithId)
        ) {
          const parent = getBlockAbove(editor, {
            at: operation.path,
          }) as BlockEntry;
          onDeleteBlock(
            (operation.properties as ElementWithId).id as string,
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
      setTimeout(() => {
        if (
          onDeleteBlock &&
          SlateElement.isElement(operation.node) &&
          typeof operation.node.id === 'string'
        ) {
          const parent = getBlockAbove(editor, {
            at: operation.path,
          }) as BlockEntry;
          onDeleteBlock(operation.node.id, parent);
        }
      });
    }
    if (
      operation.type === 'split_node' &&
      !editor.isInline(operation.properties as ElementWithId) &&
      (operation.properties as ElementWithId).type
    ) {
      apply(operation);

      setTimeout(() => {
        const updatedBlock = Node.get(editor, operation.path) as ElementWithId;
        if (onUpdateBlock && updatedBlock) {
          onUpdateBlock([updatedBlock, operation.path]);
        }

        const newBlockPath = Path.next(operation.path);
        const newBlock = Node.get(editor, newBlockPath) as ElementWithId;
        if (onCreateBlock && newBlock) {
          const parent = getBlockAbove(editor, {
            at: operation.path,
          }) as BlockEntry;
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
          setTimeout(() => {
            const block = getBlockAbove(editor) as BlockEntry;
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
            ) as ElementWithId;
            if (block) {
              onUpdateBlock([block, operation.path.slice(0, -1)]);
            }
          }
          const parent = getBlockAbove(editor, {
            at: operation.path,
          }) as BlockEntry;
          onCreateBlock(
            [operation.node as ElementWithId, operation.path],
            parent,
          );
        });
        return;
      }
    }

    apply(operation);
  };

  return {};
};

export default BlockApiPlugin;
