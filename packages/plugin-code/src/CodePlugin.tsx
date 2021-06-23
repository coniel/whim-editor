import React from 'react';
import {
  BraindropEditorPluginFactory,
  getBlockAbove,
  Transforms,
  BraindropEditorPluginLeafDescriptor,
} from '@braindrop-editor/core';
import { Element } from 'slate';
import isHotkey from 'is-hotkey';
import { ReactEditor } from 'slate-react';
import { createDecorator } from './createDecorator';
import { ElementCode, ElementCodeProps } from './ElementCode';
import { LeafCode } from './LeafCode';
import { CodeElement, CodeText } from './CodePlugin.types';

interface BlockOptions {
  type?: string;
  component?: React.ComponentType<ElementCodeProps>;
  hotkeys?: string[];
}

export interface CodePluginOptions {
  block?: BlockOptions;
  mark?: Partial<BraindropEditorPluginLeafDescriptor>;
  defaultLanguage?: string;
}

export const createCodePlugin = (
  options: CodePluginOptions = {},
): BraindropEditorPluginFactory<CodeElement> => (editor) => {
  const defaultLanguage = options.defaultLanguage || 'javascript';
  const blockType = (options.block && options.block.type) || 'code';
  const BlockComponent =
    (options.block && options.block.component) || ElementCode;

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
              language: defaultLanguage,
            } as Partial<CodeElement>,
            turnIntoOptions,
          );
        },
        insert: (editor, insertOptions): void => {
          Transforms.insertNodes(
            editor,
            {
              type: blockType,
              properties: { language: defaultLanguage },
              children: [{ text: '' }],
            } as CodeElement,
            insertOptions,
          );
        },
        ...(options.block || {}),
        component: (props) => (
          <BlockComponent {...props} onSetLanguage={setBlockLanguage} />
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
