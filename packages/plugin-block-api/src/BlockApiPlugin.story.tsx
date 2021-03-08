import React, { useState } from 'react';
import { Node } from 'slate';
import components from '@sheets-editor/material-ui';
import { Editor } from '@sheets-editor/core';
import createBlockIdPlugin from '@sheets-editor/plugin-block-id';
import createParagraphPlugin from '@sheets-editor/plugin-paragraph';
import createEquationPlugin from '@sheets-editor/plugin-equation';
import createBlockPlugin from '@sheets-editor/plugin-block';
import BlockApiPlugin from './BlockApiPlugin';

export default { title: 'Plugins|BlockApi' };

const BlockApi = BlockApiPlugin({
  onUpdateBlock: (block) => console.log('updated block', block),
  onCreateBlock: (block) => console.log('created block', block),
  onDeleteBlock: (block) => console.log('deleted block', block),
});
const BlockIdPlugin = createBlockIdPlugin({ ignoreTypes: ['equation-inline'] });
const EquationPlugin = createEquationPlugin();
const ParagraphPlugin = createParagraphPlugin();
const CustomBlockApi = BlockApiPlugin({});
const BlockPlugin = createBlockPlugin();

export const WithBlockApiPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
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

export const WithCustomisedBlockApiPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'text',
      children: [{ text: 'I use the BlockApiPlugin with custom options.' }],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[CustomBlockApi]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
