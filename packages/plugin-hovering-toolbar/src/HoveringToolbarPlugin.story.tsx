import React, { useState } from 'react';
import { Node } from 'slate';
import components from '@sheets-editor/material-ui';
import { Editor } from '@sheets-editor/core';
import { HoveringToolbar } from './HoveringToolbar';

export default { title: 'Plugins|HoveringToolbar' };

export const WithHoveringToolbarPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'text',
      children: [{ text: 'I use the HoveringToolbarPlugin.' }],
    },
    {
      type: 'text',
      children: [{ text: 'I use the HoveringToolbarPlugin.' }],
    },
    {
      type: 'text',
      children: [{ text: 'I use the HoveringToolbarPlugin.' }],
    },
    {
      type: 'text',
      children: [{ text: 'I use the HoveringToolbarPlugin.' }],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    >
      <HoveringToolbar>
        <div
          style={{
            backgroundColor: '#FFF',
            borderRadius: 3,
            padding: 2,
            boxShadow:
              'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px',
          }}
        >
          Toolbar content
        </div>
      </HoveringToolbar>
    </Editor>
  );
};
