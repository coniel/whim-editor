import React, { useState } from 'react';
import { Descendant } from 'slate';
import { Editor } from '@braindrop-editor/core';
import { components } from '@braindrop-editor/material-ui';
import { createHeadingPlugin } from './HeadingPlugin';

export default { title: 'Plugins/Heading' };

const Heading = createHeadingPlugin();

export const Default: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'h1',
      id: '1',
      children: [{ text: 'Heading 1' }],
    },
    {
      type: 'h2',
      id: '2',
      children: [{ text: 'Heading 2' }],
    },
    {
      type: 'h3',
      id: '3',
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

export const Placeholders: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'h1',
      id: '1',
      children: [{ text: '' }],
    },
    {
      type: 'h2',
      id: '2',
      children: [{ text: '' }],
    },
    {
      type: 'h3',
      id: '3',
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
