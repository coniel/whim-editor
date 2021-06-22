import React from 'react';
import {
  SlashPluginFactory,
  SlashPlugin,
  SlashEditor,
} from '@sheets-editor/core';
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
): SlashPluginFactory => (editor: SlashEditor): SlashPlugin => {
  function toggleDone(element: ToDoListElement) {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(
      editor,
      { done: !element.done } as Partial<ToDoListElement>,
      {
        at: path,
      },
    );

    if (typeof options.onToggleChecked === 'function') {
      options.onToggleChecked(element, element.done);
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
            element={props.element as ToDoListElement}
          />
        ),
        shortcuts: ['[]'],
      },
    ],
  };
};
