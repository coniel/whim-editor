import React, { useState } from 'react';
import { Descendant } from 'slate';
import { components } from '@braindrop-editor/material-ui';
import { Editor } from '@braindrop-editor/core';
import { createOrderedListPlugin } from './OrderedListPlugin';
import { OrderedListElement } from './OrderedListPlugin.types';

export default { title: 'Plugins/OrderedList' };

type OrderedListDescendant = Descendant | OrderedListElement;

const OrderedList = createOrderedListPlugin();
const CustomOrderedList = createOrderedListPlugin({});

export const WithOrderedListPlugin: React.FC = () => {
  const [value, setValue] = useState<OrderedListDescendant[]>([
    {
      type: 'ol',
      id: '1',
      properties: { number: 1 },
      children: [{ text: 'List item 1' }],
    },
    {
      type: 'ol',
      id: '2',
      properties: { number: 2 },
      children: [{ text: 'List item 2' }],
    },
    {
      type: 'ol',
      id: '3',
      properties: { number: 3 },
      children: [{ text: 'List item 3' }],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[OrderedList]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};

export const WithCustomisedOrderedListPlugin: React.FC = () => {
  const [value, setValue] = useState<OrderedListDescendant[]>([
    {
      type: 'ol',
      id: '1',
      properties: { number: 1 },
      children: [{ text: 'List item 1' }],
    },
    {
      type: 'ol',
      id: '2',
      properties: { number: 2 },
      children: [{ text: 'List item 2' }],
    },
    {
      type: 'ol',
      id: '3',
      properties: { number: 3 },
      children: [{ text: 'List item 3' }],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[CustomOrderedList]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
