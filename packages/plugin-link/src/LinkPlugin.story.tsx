import React, { useState } from 'react';
import { Node } from 'slate';
import components from '@sheets-editor/material-ui';
import { Editor, useEditorState } from '@sheets-editor/core';
import LinkPlugin from './LinkPlugin';
import { useEditor } from 'slate-react';
import { EditorWithLinkPlugin } from './LinkPlugin.types';
import { LinkPopover } from './LinkPopover';

export default { title: 'Plugins|Link' };

const Link = LinkPlugin();
const CustomLink = LinkPlugin({});
const initialValue = [
  {
    children: [
      {
        text: 'In addition to block nodes, you can create inline nodes, like ',
      },
      {
        type: 'link',
        url: 'https://en.wikipedia.org/wiki/Hypertext',
        children: [{ text: 'hyperlinks' }],
      },
      {
        text: '!',
      },
    ],
  },
  {
    children: [
      {
        text:
          'This example shows hyperlinks in action. It features two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected.',
      },
    ],
  },
];

const Toolbar: React.FC = () => {
  const editor = useEditor() as EditorWithLinkPlugin;

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
      <LinkPopover />
    </div>
  );
};

export const WithLinkPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>(initialValue);

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
