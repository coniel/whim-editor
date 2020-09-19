import React from 'react';
import {
  SlashPluginFactory,
  SlashPlugin,
  SlashEditor,
  getBlockAbove,
  Transforms,
  RenderElementProps,
  SlashPluginLeafDescriptor,
  SlashPluginElementDescriptor,
} from '@sheets-editor/core';
import isHotkey from 'is-hotkey';
import { ReactEditor } from 'slate-react';
import { createDecorator } from './createDecorator';
import ElementCode from './ElementCode';
import LeafCode from './LeafCode';

export interface CodePluginOptions {
  block?: Partial<SlashPluginElementDescriptor>;
  mark?: Partial<SlashPluginLeafDescriptor>;
  defaultLanguage?: string;
}

const CodePlugin = (options: CodePluginOptions = {}): SlashPluginFactory => (
  editor: SlashEditor,
): SlashPlugin => {
  let blockType = 'code';

  if (options.block && options.block.type) {
    blockType = options.block.type;
  }

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
        if (parent[0].type === 'code') {
          event.preventDefault();
          editor.insertText('  ');
        }
      }
    },
    decorate: createDecorator(editor, blockType),
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
        type: blockType,
        shortcuts: ['``` '],
        component: (props): React.ReactElement => (
          <ElementCode {...props} onSetLanguage={setBlockLanguage} />
        ),
        returnBehaviour: 'soft-break',
        turnInto: (editor): void => {
          Transforms.setNodes(editor, {
            type: blockType,
            language: options.defaultLanguage || 'javascript',
          });
        },
        insert: (editor): void => {
          Transforms.insertNodes(editor, {
            type: blockType,
            language: options.defaultLanguage || 'javascript',
            children: [{ text: '' }],
          });
        },
        ...(options.block || {}),
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
