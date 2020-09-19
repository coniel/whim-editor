import React from 'react';
import {
  Editor as SheetsEditor,
  EditorProps as SheetsEditorProps,
  SlashPluginFactory,
  SlashEditor,
  SlashPlugin,
} from '@sheets-editor/core';
import createRichTextPlugin from '@sheets-editor/plugin-rich-text';
import createHeadingPlugin from '@sheets-editor/plugin-heading';
import createOLPlugin from '@sheets-editor/plugin-ordered-list';
import createULPlugin from '@sheets-editor/plugin-unordered-list';
import createLinkPlugin from '@sheets-editor/plugin-link';
import createCodePlugin from '@sheets-editor/plugin-code';
import createEquationPlugin from '@sheets-editor/plugin-equation';
import createBlockquotePlugin from '@sheets-editor/plugin-blockquote';
import createParagraphPlugin from '@sheets-editor/plugin-paragraph';
import createBlockPlugin from '@sheets-editor/plugin-block';
import { Node as SlateNode } from 'slate';
import muiComponents from '@sheets-editor/material-ui';
import { HoveringToolbar } from './HoveringToolbar';

export type Node = SlateNode;
export type EditorProps = Pick<SheetsEditorProps, 'onChange' | 'value'>;

const RichTextPlugin = createRichTextPlugin({
  marks: {
    bold: 'b',
    italic: 'i',
    'strike-through': 's',
    underline: 'u',
  },
});
const HeadingPlugin = createHeadingPlugin({
  types: {
    'heading-1': 'h1',
    'heading-2': 'h2',
    'heading-3': 'h3',
  },
  hotkeys: {
    'heading-1': 'mod+alt+1',
    'heading-2': 'mod+alt+2',
    'heading-3': 'mod+alt+3',
  },
});
const BlockPlugin = createBlockPlugin();
const LinkPlugin = createLinkPlugin();
const OLPlugin = createOLPlugin({ hotkeys: ['mod+alt+5'] });
const ULPlugin = createULPlugin({ hotkeys: ['mod+alt+4'] });
const CodePlugin = createCodePlugin({ block: { hotkeys: ['mod+alt+9'] } });
const EquationPlugin = createEquationPlugin({
  block: { hotkeys: ['mod+alt+0'] },
});
const ParagraphPlugin = createParagraphPlugin();
const BlockquotePlugin = createBlockquotePlugin({
  blockquote: { hotkeys: ['mod+alt+3'] },
});

const createHeightPlugin = (): SlashPluginFactory => (
  editor: SlashEditor,
): SlashPlugin => {
  const { renderEditable } = editor;

  editor.renderEditable = (props): JSX.Element =>
    renderEditable({
      ...props,
      style: { minHeight: 200, height: '100%' },
      placeholder: 'Description',
    });

  return {};
};

const HeightPlugin = createHeightPlugin();

export const Editor: React.FC<EditorProps> = ({
  onChange,
  children,
  value,
}) => {
  return (
    <SheetsEditor
      components={muiComponents}
      plugins={[
        HeightPlugin,
        RichTextPlugin,
        ParagraphPlugin,
        HeadingPlugin,
        LinkPlugin,
        OLPlugin,
        ULPlugin,
        CodePlugin,
        EquationPlugin,
        BlockquotePlugin,
        EquationPlugin,
        // BlockPlugin,
      ]}
      onChange={onChange}
      value={value}
    >
      <HoveringToolbar />
      {children}
    </SheetsEditor>
  );
};
