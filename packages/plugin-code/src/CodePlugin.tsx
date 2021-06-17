import React from 'react';
import {
  SlashPluginFactory,
  getBlockAbove,
  Transforms,
  SlashPluginLeafDescriptor,
  SlashPluginElementDescriptor,
} from '@sheets-editor/core';
import { Element } from 'slate';
import isHotkey from 'is-hotkey';
import { ReactEditor } from 'slate-react';
import { createDecorator } from './createDecorator';
import ElementCode, { ElementCodeProps } from './ElementCode';
import LeafCode from './LeafCode';
import { CodeElement, CodeText } from './CodePlugin.types';

interface BlockOptions extends Omit<SlashPluginElementDescriptor, 'component'> {
  component: React.FC<ElementCodeProps>;
}

export interface CodePluginOptions {
  block?: Partial<BlockOptions>;
  mark?: Partial<SlashPluginLeafDescriptor>;
  defaultLanguage?: string;
}

const CodePlugin = (options: CodePluginOptions = {}): SlashPluginFactory => (
  editor,
) => {
  let blockType = 'code';
  let BlockComponent: BlockOptions['component'] = ElementCode;
  if (options.block && options.block.component) {
    BlockComponent = options.block.component;
  }

  if (options.block && options.block.type) {
    blockType = options.block.type;
  }

  function setBlockLanguage(element: CodeElement, language: string): void {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { language } as Partial<CodeElement>, {
      at: path,
    });
  }

  return {
    onKeyDown: (event): void => {
      if (isHotkey('Tab', (event as unknown) as KeyboardEvent)) {
        const parent = getBlockAbove(editor);
        if (Element.isElement(parent[0]) && parent[0].type === 'code') {
          event.preventDefault();
          editor.insertText('  ');
        }
      }
    },
    decorate: createDecorator(editor, blockType),
    renderLeaf: ({ attributes, children, leaf }): React.ReactElement => {
      const codeLeaf = leaf as CodeText;
      if (codeLeaf.decorateCode) {
        return (
          <span {...attributes} className={`token ${codeLeaf.token}`}>
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
        returnBehaviour: 'soft-break',
        turnInto: (editor, element, turnIntoOptions): void => {
          Transforms.setNodes(
            editor,
            {
              type: blockType,
              language: options.defaultLanguage || 'javascript',
            } as Partial<CodeElement>,
            turnIntoOptions,
          );
        },
        insert: (editor, insertOptions): void => {
          Transforms.insertNodes(
            editor,
            {
              type: blockType,
              language: options.defaultLanguage || 'javascript',
              children: [{ text: '' }],
            } as CodeElement,
            insertOptions,
          );
        },
        ...(options.block || {}),
        component: (props): React.ReactElement => (
          <BlockComponent
            {...props}
            element={props.element as CodeElement}
            onSetLanguage={setBlockLanguage}
          />
        ),
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
