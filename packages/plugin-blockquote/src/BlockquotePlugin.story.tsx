import React, { useState } from 'react';
import { Descendant } from 'slate';
import { components } from '@braindrop-editor/material-ui';
import { Editor } from '@braindrop-editor/core';
import { createBlockquotePlugin } from './BlockquotePlugin';

export default { title: 'Plugins/Blockquote' };

const Blockquote = createBlockquotePlugin();

export const WithBlockquotePlugin: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'blockquote',
      id: '1',
      properties: {},
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
