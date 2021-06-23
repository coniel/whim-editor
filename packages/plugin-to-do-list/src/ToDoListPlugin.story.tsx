/* eslint-disable no-console */
import React, { useState } from 'react';
import { Descendant } from 'slate';
import { components } from '@braindrop-editor/material-ui';
import { Editor } from '@braindrop-editor/core';
import { createToDoListPlugin } from './ToDoListPlugin';
import { ToDoListElement } from './ToDoListPlugin.types';

type ToDoListDescendant = Descendant | ToDoListElement;

export default { title: 'Plugins/ToDoList' };

const ToDoList = createToDoListPlugin({
  onToggleChecked: (element, checked) => console.log(element, checked),
});

export const WithToDoListPlugin: React.FC = () => {
  const [value, setValue] = useState<ToDoListDescendant[]>([
    {
      type: 'text',
      id: '1',
      children: [{ text: 'To-do:' }],
      properties: {},
    },
    {
      type: 'to-do',
      id: '2',
      properties: { done: true },
      children: [{ text: 'Test features' }],
    },
    {
      type: 'to-do',
      id: '3',
      properties: { done: false },
      children: [{ text: 'Fix bugs' }],
    },
    {
      type: 'to-do',
      id: '4',
      properties: { done: false },
      children: [{ text: 'Launch' }],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[ToDoList]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
