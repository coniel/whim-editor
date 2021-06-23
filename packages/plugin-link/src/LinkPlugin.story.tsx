import React, { useState } from 'react';
import { Descendant } from 'slate';
import { components } from '@braindrop-editor/material-ui';
import { Editor } from '@braindrop-editor/core';
import { createLinkPlugin } from './LinkPlugin';
import { useSlateStatic } from 'slate-react';
import { EditorWithLinkPlugin } from './LinkPlugin.types';

export default { title: 'Plugins/Link' };

const Link = createLinkPlugin();
const initialValue = [
  {
    type: 'paragraph',
    id: '1',
    properties: {},
    children: [
      {
        text: 'In addition to block nodes, you can create inline nodes, like ',
      },
      {
        type: 'link',
        id: 'link-1',
        properties: { url: 'https://en.wikipedia.org/wiki/Hypertext' },
        children: [{ text: 'hyperlinks' }],
      },
      {
        text: '!',
      },
    ],
  },
  {
    type: 'paragraph',
    id: '2',
    properties: {},
    children: [
      {
        text:
          'This example shows hyperlinks in action. It features two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected.',
      },
    ],
  },
];

const Toolbar: React.FC = () => {
  const editor = useSlateStatic() as EditorWithLinkPlugin;

  return (
    <div>
      <button
        type="button"
        style={{ marginRight: 8, fontWeight: 'bold' }}
        onMouseDown={(event): void => {
          event.preventDefault();
          event.stopPropagation();
          editor.openLinkPopover();
        }}
      >
        B
      </button>
    </div>
  );
};

export const WithLinkPlugin: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[Link]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    >
      <Toolbar />
    </Editor>
  );
};
