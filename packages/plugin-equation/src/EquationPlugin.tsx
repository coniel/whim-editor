import {
  BraindropEditorPluginFactory,
  BraindropEditor,
  TurnInto,
  Insert,
} from '@braindrop-editor/core';
import { Transforms, Node } from 'slate';
import 'katex/dist/katex.min.css';
import 'katex/dist/contrib/mhchem.js';
import { ElementEquationInline } from './ElementEquationInline';
import { ElementEquationBlock } from './ElementEquationBlock';
import {
  BlockEquationElement,
  InlineEquationElement,
} from './EquationPlugin.types';

export interface BraindropEditorWithEquation extends BraindropEditor {
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

export const createEquationPlugin = (
  options: EquationPluginOptions = {},
): BraindropEditorPluginFactory<
  BlockEquationElement | InlineEquationElement
> => (editor: BraindropEditor) => {
  const equationEditor = editor as BraindropEditorWithEquation;
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
      editor.generateElement(inlineType, { expression }),
      options,
    );
  };

  const turnIntoInlineEquation: TurnInto = (editor, element, options) => {
    Transforms.wrapNodes(
      editor,
      editor.generateElement(inlineType, { expression: Node.string(element) }),
      { split: true, ...options },
    );
  };

  const insertBlockEquation: Insert = (editor, options) => {
    Transforms.insertNodes(
      editor,
      editor.generateElement(inlineType, { expression: '' }),
      options,
    );
  };

  const turnIntoBlockEquation: TurnInto = (editor, element, options): void => {
    Transforms.setNodes(
      editor,
      editor.generateElement(inlineType, { expression: Node.string(element) }),
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
