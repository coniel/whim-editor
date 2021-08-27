/* eslint-disable no-console */
import React, { useState } from 'react';
import { Descendant } from 'slate';
import { components } from '@braindrop-editor/material-ui';
import { Editor } from '@braindrop-editor/core';
import { createCodePlugin } from './CodePlugin';
import { ElementCode, ElementCodeProps } from './ElementCode';
import { CodeElement, CodeLeaf } from './CodePlugin.types';

export default { title: 'Plugins/Code' };

type CodeDescendant = CodeLeaf | Descendant | CodeElement;

const CodePlugin = createCodePlugin({
  defaultLanguage: 'typescript',
  block: { hotkeys: ['mod+alt+6'] },
});

export const CodeBlock: React.FC = () => {
  const [value, setValue] = useState<CodeDescendant[]>([
    {
      type: 'code',
      id: '1',
      language: 'javascript',
      children: [{ text: 'function foo() {\n  alert("foo");\n}' }],
    },
  ]);
  console.log(value);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[CodePlugin]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};

const CustomBlock: React.FC<ElementCodeProps> = ({ children, ...other }) => (
  <div style={{ padding: 8, border: '1px solid blue' }}>
    <ElementCode {...other}>{children}</ElementCode>
  </div>
);

const CustomCodePlugin = createCodePlugin({
  defaultLanguage: 'typescript',
  block: { hotkeys: ['mod+alt+6'], component: CustomBlock },
});

export const CodeBlockWithCustomComponent: React.FC = () => {
  const [value, setValue] = useState<CodeDescendant[]>([
    {
      type: 'code',
      id: '1',
      language: 'javascript',
      children: [{ text: 'function foo() {\n  alert("foo");\n}' }],
    },
  ]);
  console.log(value);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[CustomCodePlugin]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};

export const InlineCode: React.FC = () => {
  const [value, setValue] = useState<CodeDescendant[]>([
    {
      type: 'paragraph',
      children: [
        { text: 'You can type inline code such as ' },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        { code: true, text: 'foo = 3' },
        { text: ' by surounding text with `.' },
      ],
    },
  ]);

  console.log(value);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[CodePlugin]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
