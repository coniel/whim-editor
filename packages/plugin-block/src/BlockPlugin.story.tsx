import React, { useState } from 'react';
import { Node } from 'slate';
import { Editor } from '@slash/editor';
import BlockPlugin from './BlockPlugin';

export default { title: 'Plugins|Block' };

const Block = BlockPlugin();
const CustomBlock = BlockPlugin({});

export const WithBlockPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'text',
      children: [{ text: 'I use the BlockPlugin.' }],
    },
  ]);

  return (
    <Editor
      value={value}
      plugins={[Block]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};

export const WithCustomisedBlockPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'text',
      children: [{ text: 'I use the BlockPlugin with custom options.' }],
    },
  ]);

  return (
    <Editor
      value={value}
      plugins={[CustomBlock]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
