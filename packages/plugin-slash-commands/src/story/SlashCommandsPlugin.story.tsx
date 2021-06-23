import React, { useState } from 'react';
import { Descendant } from 'slate';
import { components } from '@sheets-editor/material-ui';
import { Editor } from '@sheets-editor/core';
import { createHeadingPlugin } from '@sheets-editor/plugin-heading';
import { createRichTextPlugin } from '@sheets-editor/plugin-rich-text';
import { createLinkPlugin } from '@sheets-editor/plugin-link';
import { createBlockquotePlugin } from '@sheets-editor/plugin-blockquote';
import { createOrderedListPlugin } from '@sheets-editor/plugin-ordered-list';
import { createUnorderedListPlugin } from '@sheets-editor/plugin-unordered-list';
import { createCodePlugin } from '@sheets-editor/plugin-code';
import { createEquationPlugin } from '@sheets-editor/plugin-equation';
import { createParagraphPlugin } from '@sheets-editor/plugin-paragraph';
import { createBlockPlugin } from '@sheets-editor/plugin-block';
import { createBlockIdPlugin } from '@sheets-editor/plugin-block-id';
import { createSlashCommandsPlugin } from '../SlashCommandsPlugin';
import { MenuItem } from '../SlashCommandsPlugin.types';

export default { title: 'Plugins/SlashCommands' };

const RichTextPlugin = createRichTextPlugin();
const LinkPlugin = createLinkPlugin();
const BlockquotePlugin = createBlockquotePlugin();
const HeadingPlugin = createHeadingPlugin();
const OLPlugin = createOrderedListPlugin();
const ULPlugin = createUnorderedListPlugin();
const CodePlugin = createCodePlugin();
const EquationPlugin = createEquationPlugin();
const ParagraphPlugin = createParagraphPlugin();
const BlockPlugin = createBlockPlugin();
const BlockIdPlugin = createBlockIdPlugin();

const menuItems: MenuItem[] = [
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
];

const SlashCommands = createSlashCommandsPlugin({ menuItems });

export const WithSlashCommandsPlugin: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>([
    { type: 'paragraph', id: '1', properties: {}, children: [{ text: '' }] },
  ]);

  return (
    <div style={{ maxWidth: 800, margin: '48px auto 0 auto' }}>
      <Editor
        components={components}
        value={value}
        plugins={[
          RichTextPlugin,
          LinkPlugin,
          BlockquotePlugin,
          HeadingPlugin,
          OLPlugin,
          ULPlugin,
          EquationPlugin,
          CodePlugin,
          SlashCommands,
          ParagraphPlugin,
          BlockPlugin,
          BlockIdPlugin,
        ]}
        onChange={(newValue): void => {
          setValue(newValue);
        }}
      />
    </div>
  );
};
