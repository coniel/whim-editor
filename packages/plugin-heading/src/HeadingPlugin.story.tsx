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
      onSelectionChange={(selection) => console.log('selection', selection)}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};

export const Placeholders: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'h1',
      children: [{ text: '' }],
    },
    {
      type: 'h2',
      children: [{ text: '' }],
    },
    {
      type: 'h3',
      children: [{ text: '' }],
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
