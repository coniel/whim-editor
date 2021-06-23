import React from 'react';
import {
  BraindropEditorPluginFactory,
  BraindropEditor,
} from '@braindrop-editor/core';
import { ReactEditor } from 'slate-react';
import { Transforms } from 'slate';
import { ElementToDoList } from './ElementToDoList';
import { ToDoListElement } from './ToDoListPlugin.types';

export interface ToDoListPluginOptions {
  checkedColor?: string;
  uncheckedColor?: string;
  onToggleChecked?: (element: ToDoListElement, checked: boolean) => void;
}

export const createToDoListPlugin = (
  options: ToDoListPluginOptions = {},
): BraindropEditorPluginFactory<ToDoListElement> => (
  editor: BraindropEditor,
) => {
  function toggleDone(element: ToDoListElement) {
    const path = ReactEditor.findPath(editor, element);

    Transforms.setNodes(
      editor,
      { done: !element.properties.done } as Partial<ToDoListElement>,
      {
        at: path,
      },
    );

    if (typeof options.onToggleChecked === 'function') {
      options.onToggleChecked(element, element.properties.done);
    }
  }

  return {
    elements: [
      {
        type: 'to-do',
        component: (props) => (
          <ElementToDoList
            {...props}
            checkedColor={options.checkedColor}
            uncheckedColor={options.uncheckedColor}
            onClickCheckbox={toggleDone}
          />
        ),
        shortcuts: ['[]'],
      },
    ],
  };
};
