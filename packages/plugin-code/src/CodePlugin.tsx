import React from 'react';
import {
  BraindropEditorPluginFactory,
  getBlockAbove,
  Transforms,
  BraindropEditorPluginLeafDescriptor,
  BraindropEditor,
  TurnIntoOptions,
  InsertOptions,
} from '@braindrop-editor/core';
import { Element } from 'slate';
import isHotkey from 'is-hotkey';
import { ReactEditor } from 'slate-react';
import { createDecorator } from './createDecorator';
import { ElementCode, ElementCodeProps } from './ElementCode';
import { LeafCode } from './LeafCode';
import {
  CodeElement,
  CodeText,
  EditorWithCodePlugin,
} from './CodePlugin.types';

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
): BraindropEditorPluginFactory<CodeElement> => (baseEditor) => {
  const editor = baseEditor as EditorWithCodePlugin;
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

  function turnIntoCodeElement(
    editor: BraindropEditor,
    element: Element,
    options?: TurnIntoOptions,
  ) {
    Transforms.setNodes(
      editor,
      {
        type: blockType,
        language: defaultLanguage,
      } as Partial<CodeElement>,
      options,
    );
  }

  function insertCodeElement(
    editor: BraindropEditor,
    insertOptions?: InsertOptions,
  ) {
    Transforms.insertNodes(
      editor,
      editor.generateElement(blockType, { language: defaultLanguage }),
      insertOptions,
    );
  }

  editor.turnIntoCodeElement = (element: Element, options?: InsertOptions) =>
    turnIntoCodeElement(editor, element, options);
  editor.insertCodeElement = (options?: InsertOptions) =>
    insertCodeElement(editor, options);

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
        turnInto: turnIntoCodeElement,
        insert: insertCodeElement,
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
