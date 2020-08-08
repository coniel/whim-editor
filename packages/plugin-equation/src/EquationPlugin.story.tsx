import React, { useState } from 'react';
import { Node, Range, Element } from 'slate';
import { Editor } from '@sheets-editor/core';
import { action } from '@storybook/addon-actions';
import { useEditor } from 'slate-react';
import * as components from '@sheets-editor/material-ui';
import EquationPlugin, { SlashEditorWithEquation } from './EquationPlugin';

export default { title: 'Plugins|Equation' };

const Equation = EquationPlugin();

const Toolbar: React.FC = () => {
  const editor = useEditor() as SlashEditorWithEquation;

  return (
    <div>
      <button
        type="button"
        style={{ marginRight: 8, fontWeight: 'bold' }}
        onMouseDown={(event): void => {
          event.preventDefault();
          event.stopPropagation();
          editor.selection && Range.isExpanded(editor.selection)
            ? editor.turnIntoInlineEquation(
                Node.get(editor, editor.selection.anchor.path) as Element,
              )
            : editor.insertInlineEquation();
        }}
      >
        Inline
      </button>
      <button
        type="button"
        style={{ marginRight: 8, fontWeight: 'bold' }}
        onMouseDown={(event): void => {
          event.preventDefault();
          event.stopPropagation();
          editor.insertBlockEquation();
        }}
      >
        Block
      </button>
    </div>
  );
};

export const WithEquationPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'text',
      children: [
        { text: 'I use the EquationPlugin: ' },
        {
          type: 'equation-inline',
          tex: 'E=mc^2',
          children: [{ text: '' }],
        },
        { text: '.' },
      ],
    },
    {
      type: 'equation',
      children: [{ text: '' }],
      tex: `\\begin{aligned}
  x&=3+5+2 \\\\
  &=8+2 \\\\
  &=10
\\end{aligned}`,
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[Equation]}
      onChange={(newValue): void => {
        setValue(newValue);
        action('onChange')(newValue);
      }}
    >
      <Toolbar />
    </Editor>
  );
};
