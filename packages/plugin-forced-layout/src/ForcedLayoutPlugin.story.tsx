/* eslint-disable no-console */
import React, { useState } from 'react';
import { Descendant } from 'slate';
import { components } from '@braindrop-editor/material-ui';
import { Editor } from '@braindrop-editor/core';
import { createHeadingPlugin } from '@braindrop-editor/plugin-heading';
import { createParagraphPlugin } from '@braindrop-editor/plugin-paragraph';
import { createUnorderedListPlugin } from '@braindrop-editor/plugin-unordered-list';
import { createEquationPlugin } from '@braindrop-editor/plugin-equation';
import { createForcedLayoutPlugin } from './ForcedLayoutPlugin';

export default { title: 'Plugins/ForcedLayout' };

const HeadingPlugin = createHeadingPlugin();
const ParagraphPlugin = createParagraphPlugin();
const UnorderedListPlugin = createUnorderedListPlugin();
const EquationPlugin = createEquationPlugin();
const ForcedLayout = createForcedLayoutPlugin({
  layout: ['h1', 'non-void'],
  defaultNonVoidType: 'ul',
  defaultVoidType: 'equation',
  defaultType: 'paragraph',
});

export const WithForcedLayoutPlugin: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'h1',
      id: '1',
      properties: {},
      children: [{ text: 'I use the forced layout plugin.' }],
    },
    {
      type: 'paragraph',
      id: '2',
      properties: {},
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

const MaxElementsForcedLayout = createForcedLayoutPlugin({
  maxRootElements: 2,
});

export const MaxDescendants: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      id: '1',
      properties: {},
      children: [{ text: 'I use the forced layout plugin.' }],
    },
    {
      type: 'paragraph',
      id: '2',
      properties: {},
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

const TrailingElementsForcedLayout = createForcedLayoutPlugin({
  trailingElement: 'paragraph',
});

export const TrailingElements: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      id: '1',
      properties: {},
      children: [
        {
          text:
            'I use the forced layout plugin to enforce a paragraph as a trailing element.',
        },
      ],
    },
    {
      type: 'ul',
      id: '2',
      properties: {},
      children: [{ text: 'Item 1' }],
    },
    {
      type: 'ul',
      id: '3',
      properties: {},
      children: [{ text: 'Item 2' }],
    },
    {
      type: 'ul',
      id: '4',
      properties: {},
      children: [{ text: 'Item 3' }],
    },
    {
      type: 'paragraph',
      id: '5',
      properties: {},
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
