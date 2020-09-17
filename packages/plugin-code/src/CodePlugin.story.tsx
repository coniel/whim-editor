import React, { useState } from 'react';
import { Node } from 'slate';
import components from '@sheets-editor/material-ui';
import { Editor } from '@sheets-editor/core';
import CodePlugin from './CodePlugin';

export default { title: 'Plugins|Code' };

const Code = CodePlugin();

export const CodeBlock: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'code',
      language: 'javascript',
      children: [{ text: 'function foo() {\n  alert("foo");\n}' }],
    },
  ]);

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
