import React, { useState } from 'react';
import { Node } from 'slate';
import { Editor } from '@slash/editor';
import * as components from '@slash/material-ui';
import BlockPlugin from './BlockPlugin';

export default { title: 'Plugins|Block' };

const Block = BlockPlugin();

export const WithBlockPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'text',
      children: [{ text: 'I use the BlockPlugin.' }],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[Block]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
