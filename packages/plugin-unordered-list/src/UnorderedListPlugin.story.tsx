import React, { useState } from 'react';
import { Node } from 'slate';
import components from '@sheets-editor/material-ui';
import { Editor } from '@sheets-editor/core';
import UnorderedListPlugin from './UnorderedListPlugin';

export default { title: 'Plugins|UnorderedList' };

const UnorderedList = UnorderedListPlugin();
const CustomUnorderedList = UnorderedListPlugin({});

export const WithUnorderedListPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'ul',
      children: [{ text: 'List item 1' }],
    },
    {
      type: 'ul',
      children: [{ text: 'List item 2' }],
    },
    {
      type: 'ul',
      children: [{ text: 'List item 3' }],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[UnorderedList]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};

export const WithCustomisedUnorderedListPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'ul',
      children: [{ text: 'List item 1' }],
    },
    {
      type: 'ul',
      children: [{ text: 'List item 2' }],
    },
    {
      type: 'ul',
      children: [{ text: 'List item 3' }],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[CustomUnorderedList]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
