import React, { useState, useReducer, useMemo } from 'react';
import { Descendant, Path } from 'slate';
import components from '@sheets-editor/material-ui';
import { Editor } from '@sheets-editor/core';
import createBlockIdPlugin from '@sheets-editor/plugin-block-id';
import createParagraphPlugin from '@sheets-editor/plugin-paragraph';
import createEquationPlugin from '@sheets-editor/plugin-equation';
import createBlockPlugin from '@sheets-editor/plugin-block';
import BlockApiPlugin, { BlockEntry } from './BlockApiPlugin';

export default { title: 'Plugins/BlockApi' };

const BlockApi = BlockApiPlugin({
  onUpdateBlock: (block) => console.log('updated block', block),
  onCreateBlock: (block) => console.log('created block', block),
  onDeleteBlock: (block) => console.log('deleted block', block),
  onMoveBlock: (from, to) => console.log('moved block', from, to),
});
const BlockIdPlugin = createBlockIdPlugin({ ignoreTypes: ['equation-inline'] });
const EquationPlugin = createEquationPlugin();
const ParagraphPlugin = createParagraphPlugin();
const BlockPlugin = createBlockPlugin();

interface Block {
  id: string;
  type: string;
  children: string[];
  content: string;
}

interface BlocksState {
  blocks: Record<string, Block>;
}

type Action =
  | { type: 'CREATE_BLOCK'; block: BlockEntry }
  | { type: 'UPDATE_BLOCK'; block: BlockEntry }
  | { type: 'DELETE_BLOCK'; blockId: string }
  | { type: 'ADD_CHILD'; blockId: string; childId: string; to: number }
  | { type: 'MOVE_CHILD'; blockId: string; from: number; to: number }
  | { type: 'REMOVE_CHILD'; blockId: string; childId: string };

function arrayMove<T>(arr: T[], oldIndex: number, newIndex: number): T[] {
  const moved = [...arr];
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1;
    while (k--) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      moved.push(undefined);
    }
  }

  moved.splice(newIndex, 0, moved.splice(oldIndex, 1)[0]);

  return moved;
}

function arrayInsert<T>(arr: T[], item: T, index: number): T[] {
  const inserted = [...arr];
  inserted.splice(index, 0, item);

  return inserted;
}

const reducer = (state: BlocksState, action: Action): BlocksState => {
  switch (action.type) {
    case 'CREATE_BLOCK':
    case 'UPDATE_BLOCK':
      return {
        blocks: {
          ...state.blocks,
          [action.block[0].id]: {
            id: action.block[0].id,
            content: JSON.stringify(action.block[0].children),
            type: action.block[0].type,
            children: [],
          },
        },
      };
    case 'DELETE_BLOCK':
      return {
        blocks: Object.keys(state.blocks)
          .filter((id) => id !== action.blockId)
          .reduce(
            (blocks, blockId) => ({
              ...blocks,
              [blockId]: state.blocks[blockId],
            }),
            {},
          ),
      };
    case 'ADD_CHILD':
      return {
        blocks: {
          ...state.blocks,
          [action.blockId]: {
            ...state.blocks[action.blockId],
            children: arrayInsert(
              state.blocks[action.blockId].children,
              action.childId,
              action.to,
            ),
          },
        },
      };
    case 'MOVE_CHILD':
      return {
        blocks: {
          ...state.blocks,
          [action.blockId]: {
            ...state.blocks[action.blockId],
            children: arrayMove(
              state.blocks[action.blockId].children,
              action.from,
              action.to,
            ),
          },
        },
      };
    case 'REMOVE_CHILD':
      return {
        blocks: {
          ...state.blocks,
          [action.blockId]: {
            ...state.blocks[action.blockId],
            children: state.blocks[action.blockId].children.filter(
              (id) => id !== action.childId,
            ),
          },
        },
      };
    default:
      return state;
  }
};

export const NestedBlocks: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      id: '1',
      children: [
        {
          type: 'paragraph',
          id: '1.1',
          children: [{ text: 'Paragraph 1.1' }],
        },
        {
          type: 'paragraph',
          id: '1.2',
          children: [{ text: 'Paragraph 1.2' }],
        },
        {
          type: 'paragraph',
          id: '1.3',
          children: [{ text: 'Paragraph 1.3' }],
        },
        {
          type: 'paragraph',
          id: '1.4',
          children: [{ text: 'Paragraph 1.4' }],
        },
      ],
    },
  ]);

  console.log(value);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[
        BlockApi,
        BlockIdPlugin,
        ParagraphPlugin,
        EquationPlugin,
        BlockPlugin,
      ]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};

export const RootBlocks: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, {
    blocks: {
      'document-block-id': {
        id: 'document-block-id',
        type: 'document',
        children: ['initial-block-id'],
        content: '',
      },
      'initial-block-id': {
        id: 'initial-block-id',
        type: 'paragraph',
        children: [],
        content: "{ text: 'I use the BlockApiPlugin' }",
      },
    },
  });
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      id: 'initial-block-id',
      children: [{ text: 'I use the BlockApiPlugin' }],
    },
  ]);

  function handleCreateBlock(block: BlockEntry, parent: BlockEntry) {
    dispatch({ type: 'CREATE_BLOCK', block });
    dispatch({
      type: 'ADD_CHILD',
      blockId: parent[0].id || 'document-block-id',
      childId: block[0].id,
      to: block[1].slice(-1)[0],
    });
  }

  function handleDeleteBlock(blockId: string, parent: BlockEntry) {
    dispatch({ type: 'DELETE_BLOCK', blockId });
    dispatch({
      type: 'REMOVE_CHILD',
      blockId: parent[0].id || 'document-block-id',
      childId: blockId,
    });
  }

  function handleMoveBlock(
    from: Path,
    to: Path,
    block: BlockEntry,
    fromParent: BlockEntry,
    toParent: BlockEntry,
  ) {
    dispatch({
      type: 'REMOVE_CHILD',
      blockId: fromParent[0].id || 'document-block-id',
      childId: block[0].id,
    });
    dispatch({
      type: 'ADD_CHILD',
      blockId: toParent[0].id || 'document-block-id',
      childId: block[0].id,
      to: to.slice(-1)[0],
    });
  }

  const BlockApi2 = useMemo(
    () =>
      BlockApiPlugin({
        onUpdateBlock: (block) => dispatch({ type: 'UPDATE_BLOCK', block }),
        onCreateBlock: handleCreateBlock,
        onDeleteBlock: handleDeleteBlock,
        onMoveBlock: handleMoveBlock,
      }),
    [],
  );

  return (
    <>
      <Editor
        components={components}
        value={value}
        plugins={[
          BlockApi2,
          BlockIdPlugin,
          ParagraphPlugin,
          EquationPlugin,
          BlockPlugin,
        ]}
        onChange={(newValue): void => {
          setValue(newValue);
        }}
      />
      <pre>{JSON.stringify(state, null, '  ')}</pre>
    </>
  );
};
