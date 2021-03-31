import React, { useState } from 'react';
import { Node } from 'slate';
import components from '@sheets-editor/material-ui';
import { Editor } from '@sheets-editor/core';
import BlockquotePlugin from './BlockquotePlugin';

export default { title: 'Plugins/Blockquote' };

const Blockquote = BlockquotePlugin();

export const WithBlockquotePlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'blockquote',
      children: [
        {
          text:
            "If there's a book that you want to read, but it hasn't been written yet, then you must write it.",
        },
      ],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[Blockquote]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
