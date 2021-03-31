import { Element } from '@sheets-editor/plugin-block-id';
import {
  SlashPluginFactory,
  SlashPlugin,
  SlashEditor,
  getBlockAbove,
} from '@sheets-editor/core';
import { Path, NodeEntry, Node } from 'slate';

export type BlockEntry = NodeEntry<Element>;

export interface BlockApiPluginOptions {
  onUpdateBlock?: (block: BlockEntry) => void;
  onDeleteBlock?: (id: string) => void;
  onCreateBlock?: (block: BlockEntry) => void;
}

const BlockApiPlugin = ({
  onCreateBlock,
  onUpdateBlock,
  onDeleteBlock,
}: BlockApiPluginOptions = {}): SlashPluginFactory => (
  editor: SlashEditor,
): SlashPlugin => {
  const { apply } = editor;

  editor.apply = (operation): void => {
    // console.log('op', operation);

    if (operation.type === 'move_node' && onUpdateBlock) {
      setTimeout(() => {
        console.log('Moved block', operation)
        // onUpdateBlock();
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
      !operation.properties.isInline &&
      operation.properties.type
    ) {
      setTimeout(() => {
        if (onDeleteBlock && typeof operation.properties.id === 'string') {
          onDeleteBlock(operation.properties.id);
        }
      });
    }
    if (
      operation.type === 'remove_node' &&
      !operation.node.isInline &&
      operation.node.type
    ) {
      setTimeout(() => {
        if (onDeleteBlock && typeof operation.node.id === 'string') {
          onDeleteBlock(operation.node.id);
        }
      });
    }
    if (
      operation.type === 'split_node' &&
      !operation.properties.isInline &&
      operation.properties.type
    ) {
      apply(operation);

      setTimeout(() => {
        const updatedBlock = Node.get(editor, operation.path) as Element;
        if (onUpdateBlock && updatedBlock) {
          onUpdateBlock([updatedBlock, operation.path]);
        }

        const newBlockPath = Path.next(operation.path);
        const newBlock = Node.get(editor, newBlockPath) as Element;
        if (onCreateBlock && newBlock) {
          onCreateBlock([newBlock, newBlockPath]);
        }
      });

      return;
    }
    if (operation.type === 'insert_node') {
      apply(operation);
      if (operation.node.isInline || !operation.node.type) {
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
            ) as Element;
            if (block) {
              onUpdateBlock([block, operation.path.slice(0, -1)]);
            }
          }
          onCreateBlock([operation.node as Element, operation.path]);
        });
        return;
      }
    }

    apply(operation);
  };

  return {};
};

export default BlockApiPlugin;
