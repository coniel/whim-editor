import React, { useState } from 'react';
import { Descendant } from 'slate';
import components from '@sheets-editor/material-ui';
import { Editor } from '@sheets-editor/core';
import OrderedListPlugin from './OrderedListPlugin';
import { OrderedListElement } from './OrderedListPlugin.types';

export default { title: 'Plugins/OrderedList' };

type OrderedListDescendant = Descendant | OrderedListElement;

const OrderedList = OrderedListPlugin();
const CustomOrderedList = OrderedListPlugin({});

export const WithOrderedListPlugin: React.FC = () => {
  const [value, setValue] = useState<OrderedListDescendant[]>([
    {
      type: 'ol',
      number: 1,
      children: [{ text: 'List item 1' }],
    },
    {
      type: 'ol',
      number: 2,
      children: [{ text: 'List item 2' }],
    },
    {
      type: 'ol',
      number: 3,
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
      number: 1,
      children: [{ text: 'List item 1' }],
    },
    {
      type: 'ol',
      number: 2,
      children: [{ text: 'List item 2' }],
    },
    {
      type: 'ol',
      number: 3,
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
