import React from 'react';
import {
  Editor as BraindropEditor,
  EditorProps as BraindropEditorProps,
  BraindropEditorPluginFactory,
} from '@braindrop-editor/core';
import { createRichTextPlugin } from '@braindrop-editor/plugin-rich-text';
import { createHeadingPlugin } from '@braindrop-editor/plugin-heading';
import { createOrderedListPlugin } from '@braindrop-editor/plugin-ordered-list';
import { createUnorderedListPlugin } from '@braindrop-editor/plugin-unordered-list';
import { createLinkPlugin } from '@braindrop-editor/plugin-link';
import { createCodePlugin } from '@braindrop-editor/plugin-code';
import { createEquationPlugin } from '@braindrop-editor/plugin-equation';
import { createBlockquotePlugin } from '@braindrop-editor/plugin-blockquote';
import { createParagraphPlugin } from '@braindrop-editor/plugin-paragraph';
import { createBlockPlugin } from '@braindrop-editor/plugin-block';
import { createBlockIdPlugin } from '@braindrop-editor/plugin-block-id';
import { createSlashCommandsPlugin } from '@braindrop-editor/plugin-slash-commands';
import { createToDoListPlugin } from '@braindrop-editor/plugin-to-do-list';
import { Node as SlateNode } from 'slate';
import { components } from '@braindrop-editor/material-ui';
import { HoveringToolbar } from './HoveringToolbar';

export type Node = SlateNode;
export type EditorProps = Pick<BraindropEditorProps, 'onChange' | 'value'>;

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
const BlockPluginId = createBlockIdPlugin();
const LinkPlugin = createLinkPlugin();
const OLPlugin = createOrderedListPlugin({ hotkeys: ['mod+alt+5'] });
const ULPlugin = createUnorderedListPlugin({ hotkeys: ['mod+alt+4'] });
const CodePlugin = createCodePlugin({ block: { hotkeys: ['mod+alt+9'] } });
const EquationPlugin = createEquationPlugin({
  block: { hotkeys: ['mod+alt+0'] },
});
const ParagraphPlugin = createParagraphPlugin();
const BlockquotePlugin = createBlockquotePlugin({
  hotkeys: ['mod+alt+3'],
});
const ToDoListPlugin = createToDoListPlugin();
const SlashCommandsPlugin = createSlashCommandsPlugin({
  menuItems: [
    {
      id: 'paragraph',
      group: 'Basic Blocks',
      title: 'Text',
      subtitle: 'Just start writing with plain text.',
      tooltip: 'Just start writing with plain text.',
      keywords: 'paragraph,plain',
      index: 0,
      image: require('./images/text.png'),
      tooltipImage: require('./images/text-tooltip.png'),
    },
    {
      id: 'h1',
      group: 'Basic Blocks',
      title: 'Heading 1',
      subtitle: 'Big section heading.',
      keywords: 'h1,one',
      index: 1,
      image: require('./images/heading-1.png'),
      tooltipImage: require('./images/heading-1-tooltip.png'),
    },
    {
      id: 'h2',
      group: 'Basic Blocks',
      title: 'Heading 2',
      subtitle: 'Medium section heading.',
      keywords: 'h2,two',
      index: 2,
      image: require('./images/heading-2.png'),
      tooltipImage: require('./images/heading-2-tooltip.png'),
    },
    {
      id: 'h3',
      group: 'Basic Blocks',
      title: 'Heading 3',
      subtitle: 'Small section heading.',
      keywords: 'h3,three',
      index: 3,
      image: require('./images/heading-3.png'),
      tooltipImage: require('./images/heading-3-tooltip.png'),
    },
    {
      id: 'ul',
      group: 'Basic Blocks',
      title: 'Bulleted list',
      subtitle: 'Create a simple bulleted list.',
      keywords: 'ul',
      index: 4,
      image: require('./images/list-bulleted.png'),
      tooltipImage: require('./images/buletted-list-tooltip.png'),
    },
    {
      id: 'ol',
      group: 'Basic Blocks',
      title: 'Numbered list',
      subtitle: 'Create a list with numbering.',
      keywords: 'ul',
      index: 5,
      image: require('./images/list-numbered.png'),
      tooltipImage: require('./images/numbered-list-tooltip.png'),
    },
    {
      id: 'equation',
      group: 'Advanced Blocks',
      title: 'Block equation',
      subtitle: 'Display a standalone math equation.',
      keywords: 'equation',
      index: 6,
      image: require('./images/equation-block.png'),
      tooltipImage: require('./images/equation-block-tooltip.png'),
    },
    {
      id: 'code',
      group: 'Advanced Blocks',
      title: 'Code',
      subtitle: 'Capture a code snippet.',
      keywords: 'code',
      index: 7,
      image: require('./images/code.png'),
      tooltipImage: require('./images/code-tooltip.png'),
    },
    {
      id: 'equation-inline',
      group: 'Inline',
      title: 'Inline equation',
      subtitle: 'Insert mathematical symbols in text',
      keywords: 'equation,tex,math',
      index: 8,
      inline: true,
      image: require('./images/equation-inline.png'),
      tooltipImage: require('./images/equation-inline-tooltip.png'),
    },
  ],
});

const createHeightPlugin = (): BraindropEditorPluginFactory => (editor) => {
  const { renderEditable } = editor;

  editor.renderEditable = (props): JSX.Element =>
    renderEditable({
      ...props,
      style: { minHeight: 200, height: '100%' },
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
    <BraindropEditor
      components={components}
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
        ToDoListPlugin,
        EquationPlugin,
        SlashCommandsPlugin,
        BlockPlugin,
        BlockPluginId,
      ]}
      onChange={onChange}
      value={value}
    >
      <HoveringToolbar />
      {children}
    </BraindropEditor>
  );
};
