import {
  SlashPluginFactory,
  SlashEditor,
  TurnInto,
  Insert,
} from '@sheets-editor/core';
import { Transforms, Node } from 'slate';
import 'katex/dist/katex.min.css';
import 'katex/dist/contrib/mhchem.js';
import { ElementEquationInline } from './ElementEquationInline';
import { ElementEquationBlock } from './ElementEquationBlock';
import {
  BlockEquationElement,
  InlineEquationElement,
} from './EquationPlugin.types';

export interface SlashEditorWithEquation extends SlashEditor {
  insertInlineEquation: Insert;
  insertBlockEquation: Insert;
  turnIntoInlineEquation: TurnInto;
  turnIntoBlockEquation: TurnInto;
}

export interface EquationPluginOptions {
  block?: {
    type?: string;
    hotkeys?: string[];
  };
  inline?: {
    type?: string;
    hotkeys?: string[];
  };
}

const EquationPlugin = (
  options: EquationPluginOptions = {},
): SlashPluginFactory<BlockEquationElement | InlineEquationElement> => (
  editor: SlashEditor,
) => {
  const equationEditor = editor as SlashEditorWithEquation;
  const blockType = (options.block || {}).type || 'equation';
  const inlineType = (options.inline || {}).type || 'equation-inline';

  const insertInlineEquation: Insert = (editor, options) => {
    let expression = '';

    if (editor.selection) {
      const selection = window.getSelection();
      if (selection) {
        expression = selection.toString();
      }
    }
    Transforms.insertNodes(
      editor,
      {
        type: inlineType,
        properties: { expression },
        children: [{ text: '' }],
      } as InlineEquationElement,
      options,
    );
  };

  const turnIntoInlineEquation: TurnInto = (editor, options) => {
    let expression = '';
    if (editor.selection) {
      const selection = window.getSelection();
      if (selection) {
        expression = selection.toString();
      }
    }

    Transforms.wrapNodes(
      editor,
      {
        type: inlineType,
        properties: { expression },
        children: [{ text: '' }],
      } as InlineEquationElement,
      { split: true, ...options },
    );
  };

  const insertBlockEquation: Insert = (editor, options) => {
    Transforms.insertNodes(
      editor,
      {
        type: blockType,
        properties: { expression: '' },
        children: [{ text: '' }],
      } as BlockEquationElement,
      options,
    );
  };

  const turnIntoBlockEquation: TurnInto = (editor, element, options): void => {
    Transforms.setNodes(
      editor,
      {
        type: blockType,
        properties: { expression: Node.string(element) },
        children: [{ text: '' }],
      } as BlockEquationElement,
      options,
    );
  };

  equationEditor.insertBlockEquation = insertBlockEquation;
  equationEditor.insertInlineEquation = insertInlineEquation;
  equationEditor.turnIntoBlockEquation = turnIntoBlockEquation;
  equationEditor.turnIntoInlineEquation = turnIntoInlineEquation;

  return {
    elements: [
      {
        isVoid: true,
        component: ElementEquationBlock,
        type: blockType,
        shortcuts: ['$$$ '],
        insert: insertBlockEquation,
        turnInto: turnIntoBlockEquation,
        ...(options.block || {}),
      },
      {
        isVoid: true,
        isInline: true,
        component: ElementEquationInline,
        type: inlineType,
        hotkeys: ['mod+Shift+e'],
        insert: insertInlineEquation,
        turnInto: turnIntoInlineEquation,
        ...(options.inline || {}),
      },
    ],
  };
};

export default EquationPlugin;
