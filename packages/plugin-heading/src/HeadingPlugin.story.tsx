import React, { useState } from 'react';
import { Node } from 'slate';
import { Editor } from '@sheets-editor/core';
import components from '@sheets-editor/material-ui';
import HeadingPlugin from './HeadingPlugin';

export default { title: 'Plugins|Heading' };

const Heading = HeadingPlugin();

export const Default: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'h1',
      children: [{ text: 'Heading 1' }],
    },
    {
      type: 'h2',
      children: [{ text: 'Heading 2' }],
    },
    {
      type: 'h3',
      children: [{ text: 'Heading 3' }],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[Heading]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
