import React, { useState } from 'react';
import { Node } from 'slate';
import components from '@sheets-editor/material-ui';
import { Editor } from '@sheets-editor/core';
import createHeadingPlugin from '@sheets-editor/plugin-heading';
import createParagraphPlugin from '@sheets-editor/plugin-paragraph';
import createUnorderedListPlugin from '@sheets-editor/plugin-unordered-list';
import createEquationPlugin from '@sheets-editor/plugin-equation';
import ForcedLayoutPlugin from './ForcedLayoutPlugin';

export default { title: 'Plugins|ForcedLayout' };

const HeadingPlugin = createHeadingPlugin();
const ParagraphPlugin = createParagraphPlugin();
const UnorderedListPlugin = createUnorderedListPlugin();
const EquationPlugin = createEquationPlugin();
const ForcedLayout = ForcedLayoutPlugin({
  layout: ['h1', 'non-void'],
  defaultNonVoidType: 'ul',
  defaultVoidType: 'equation',
  defaultType: 'paragraph',
});

export const WithForcedLayoutPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'h1',
      children: [{ text: 'I use the forced layout plugin.' }],
    },
    {
      type: 'paragraph',
      children: [
        {
          text:
            'My first element must be a Heading 1, and my second element must be non-void.',
        },
      ],
    },
  ]);

  console.log(value);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[
        ParagraphPlugin,
        HeadingPlugin,
        UnorderedListPlugin,
        EquationPlugin,
        ForcedLayout,
      ]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};

const MaxElementsForcedLayout = ForcedLayoutPlugin({
  maxRootElements: 2,
});

export const MaxNodes: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: 'I use the forced layout plugin.' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'I can only contain a maximum of 2 elements.' }],
    },
  ]);

  console.log(value);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[ParagraphPlugin, MaxElementsForcedLayout]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};

const TrailingElementsForcedLayout = ForcedLayoutPlugin({
  trailingElement: 'paragraph',
});

export const TrailingElements: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [
        {
          text:
            'I use the forced layout plugin to enforce a paragraph as a trailing element.',
        },
      ],
    },
    {
      type: 'ul',
      children: [{ text: 'Item 1' }],
    },
    {
      type: 'ul',
      children: [{ text: 'Item 2' }],
    },
    {
      type: 'ul',
      children: [{ text: 'Item 3' }],
    },
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  console.log(value);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[
        ParagraphPlugin,
        HeadingPlugin,
        UnorderedListPlugin,
        EquationPlugin,
        TrailingElementsForcedLayout,
      ]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
