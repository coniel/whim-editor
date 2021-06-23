import React, { useState } from 'react';
import { Descendant } from 'slate';
import { components } from '@braindrop-editor/material-ui';
import { Editor } from '@braindrop-editor/core';
import { createParagraphPlugin } from './ParagraphPlugin';

export default { title: 'Plugins/Paragraph' };

const Paragraph = createParagraphPlugin();
const CustomParagraph = createParagraphPlugin({});

export const WithParagraphPlugin: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      id: '1',
      properties: {},
      children: [{ text: 'I use the ParagraphPlugin.' }],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[Paragraph]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};

export const WithCustomisedParagraphPlugin: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      id: '2',
      properties: {},
      children: [{ text: 'I use the ParagraphPlugin with custom options.' }],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[CustomParagraph]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
