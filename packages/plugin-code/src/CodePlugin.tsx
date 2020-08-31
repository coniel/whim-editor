import React from 'react';
import {
  SlashPluginFactory,
  SlashPlugin,
  SlashEditor,
  getBlockAbove,
  Transforms,
  RenderElementProps,
} from '@sheets-editor/core';
import isHotkey from 'is-hotkey';
import { ReactEditor } from 'slate-react';
import { createDecorator } from './createDecorator';
import ElementCode from './ElementCode';
import LeafCode from './LeafCode';

export interface CodePluginOptions {
  foo?: string;
}

const CodePlugin = (options: CodePluginOptions = {}): SlashPluginFactory => (
  editor: SlashEditor,
): SlashPlugin => {
  function setBlockLanguage(
    element: RenderElementProps['element'],
    language: string,
  ): void {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { language }, { at: path });
  }

  return {
    onKeyDown: (event): void => {
      if (isHotkey('Tab', (event as unknown) as KeyboardEvent)) {
        const parent = getBlockAbove(editor);
        if (parent[0].type === 'code-block') {
          event.preventDefault();
          editor.insertText('  ');
        }
      }
    },
    decorate: createDecorator(editor),
    renderLeaf: ({ attributes, children, leaf }): React.ReactElement => {
      if (leaf.decorateCode) {
        return (
          <span {...attributes} className={`token ${leaf.token}`}>
            {children}
          </span>
        );
      }

      return children;
    },
    elements: [
      {
        type: 'code-block',
        component: (props): React.ReactElement => (
          <ElementCode {...props} onSetLanguage={setBlockLanguage} />
        ),
        returnBehaviour: 'soft-break',
      },
    ],
    leaves: [
      {
        mark: 'code',
        component: LeafCode,
        shortcuts: [{ start: '`', end: '`' }],
      },
    ],
  };
};

export default CodePlugin;
