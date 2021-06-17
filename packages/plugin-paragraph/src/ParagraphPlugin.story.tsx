import React, { useState } from 'react';
import { Descendant } from 'slate';
import components from '@sheets-editor/material-ui';
import { Editor } from '@sheets-editor/core';
import ParagraphPlugin from './ParagraphPlugin';

export default { title: 'Plugins/Paragraph' };

const Paragraph = ParagraphPlugin();
const CustomParagraph = ParagraphPlugin({});

export const WithParagraphPlugin: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
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
