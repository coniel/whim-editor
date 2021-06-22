/* eslint-disable no-console */
import React, { useState } from 'react';
import { Descendant } from 'slate';
import components from '@sheets-editor/material-ui';
import { Editor } from '@sheets-editor/core';
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
      children: [{ text: 'To-do:' }],
    },
    {
      type: 'to-do',
      done: true,
      children: [{ text: 'Test features' }],
    },
    {
      type: 'to-do',
      done: false,
      children: [{ text: 'Fix bugs' }],
    },
    {
      type: 'to-do',
      done: false,
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
