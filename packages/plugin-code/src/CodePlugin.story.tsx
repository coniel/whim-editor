import React, { useState } from 'react';
import { Node } from 'slate';
import components from '@sheets-editor/material-ui';
import { Editor } from '@sheets-editor/core';
import CodePlugin from './CodePlugin';
import ElementCode, { ElementCodeProps } from './ElementCode';

export default { title: 'Plugins|Code' };

const Code = CodePlugin({
  defaultLanguage: 'typescript',
  block: { hotkeys: ['mod+alt+6'] },
});

export const CodeBlock: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'code',
      language: 'javascript',
      children: [{ text: 'function foo() {\n  alert("foo");\n}' }],
    },
  ]);
  console.log(value);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[Code]}
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

const CustomCode = CodePlugin({
  defaultLanguage: 'typescript',
  block: { hotkeys: ['mod+alt+6'], component: CustomBlock },
});

export const CodeBlockWithCustomComponent: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'code',
      language: 'javascript',
      children: [{ text: 'function foo() {\n  alert("foo");\n}' }],
    },
  ]);
  console.log(value);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[CustomCode]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};

export const InlineCode: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [
        { text: 'You can type inline code such as ' },
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
      plugins={[Code]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
