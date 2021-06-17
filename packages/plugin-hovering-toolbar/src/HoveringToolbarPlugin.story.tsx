import React, { useState } from 'react';
import { Descendant } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import components from '@sheets-editor/material-ui';
import { Editor } from '@sheets-editor/core';
import createRichTextPlugin, {
  EditorWithRichTextPlugin,
} from '@sheets-editor/plugin-rich-text';
import createLinkPlugin, {
  EditorWithLinkPlugin,
} from '@sheets-editor/plugin-link';
import { HoveringToolbar } from './HoveringToolbar';

interface EditorWithPlugins
  extends EditorWithLinkPlugin,
    EditorWithRichTextPlugin {}

export default { title: 'Plugins/HoveringToolbar' };

const RichText = createRichTextPlugin();
const Link = createLinkPlugin();

const Toolbar: React.FC = () => {
  const editor = useSlateStatic() as EditorWithPlugins;

  return (
    <>
      <button
        type="button"
        style={{ marginRight: 8, fontWeight: 'bold' }}
        onMouseDown={(event): void => {
          event.preventDefault();
          event.stopPropagation();
          editor.toggleRichTextFormat('bold');
          ReactEditor.focus(editor);
        }}
      >
        B
      </button>
      <button
        type="button"
        style={{ marginRight: 8 }}
        onMouseDown={(event): void => {
          event.preventDefault();
          editor.toggleRichTextFormat('italic');
        }}
      >
        <em>I</em>
      </button>
      <button
        type="button"
        style={{ marginRight: 8 }}
        onMouseDown={(event): void => {
          event.preventDefault();
          editor.toggleRichTextFormat('underline');
        }}
      >
        <u>U</u>
      </button>
      <button
        type="button"
        style={{ marginRight: 8, textDecoration: 'line-through' }}
        onMouseDown={(event): void => {
          event.preventDefault();
          editor.toggleRichTextFormat('strike-through');
        }}
      >
        S
      </button>
      <button
        type="button"
        style={{ marginRight: 8, fontWeight: 'bold' }}
        onMouseDown={(event): void => {
          event.preventDefault();
          event.stopPropagation();
          editor.openLinkPopover();
        }}
      >
        Link
      </button>
    </>
  );
};

export const WithHoveringToolbarPlugin: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>([
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
      plugins={[RichText, Link]}
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
          <Toolbar />
        </div>
      </HoveringToolbar>
    </Editor>
  );
};
