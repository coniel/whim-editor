import React from 'react';
import isHotkey from 'is-hotkey';
import {
  BraindropEditorPluginFactory,
  BraindropEditor,
  getBlockAbove,
  isNodeType,
} from '@braindrop-editor/core';
import { ReactEditor } from 'slate-react';
import { Transforms } from 'slate';
import { ElementToDoList } from './ElementToDoList';
import { ToDoListElement } from './ToDoListPlugin.types';

export interface ToDoListPluginOptions {
  type?: string;
  checkedColor?: string;
  uncheckedColor?: string;
  onToggleChecked?: (element: ToDoListElement, checked: boolean) => void;
}

export const createToDoListPlugin = (
  options: ToDoListPluginOptions = {},
): BraindropEditorPluginFactory<ToDoListElement> => (
  editor: BraindropEditor,
) => {
  const type = options.type || 'to-do';
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
    onKeyDown: (event) => {
      if (isHotkey('mod+Enter', (event as unknown) as KeyboardEvent)) {
        const parent = getBlockAbove(editor);
        if (isNodeType(parent, { allow: [type] })) {
          toggleDone(parent[0] as ToDoListElement);
        }
      }
    },
    elements: [
      {
        type,
        returnBehaviour: 'same-type',
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
