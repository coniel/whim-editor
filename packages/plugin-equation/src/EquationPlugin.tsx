import {
  SlashPluginFactory,
  SlashPlugin,
  SlashEditor,
  SlashPluginElementDescriptor,
  TurnInto,
  Insert,
} from '@sheets-editor/core';
import { Transforms, Element, Node } from 'slate';
import 'katex/dist/katex.min.css';
import 'katex/dist/contrib/mhchem.js';
import InlineEquationPlaceholder from './ElementEquationInline';
import BlockEquation from './ElementEquationBlock';

export interface SlashEditorWithEquation extends SlashEditor {
  insertInlineEquation: Insert;
  insertBlockEquation: Insert;
  turnIntoInlineEquation: TurnInto;
  turnIntoBlockEquation: TurnInto;
}

export interface EquationPluginOptions {
  block?: Partial<SlashPluginElementDescriptor>;
  inline?: Partial<SlashPluginElementDescriptor>;
}

const EquationPlugin = (
  options: EquationPluginOptions = {},
): SlashPluginFactory => (editor: SlashEditor): SlashPlugin => {
  const equationEditor = editor as SlashEditorWithEquation;
  const blockType = (options.block || {}).type || 'equation';
  const inlineType = (options.inline || {}).type || 'equation-inline';

  const insertInlineEquation: Insert = (editor, options) => {
    let tex = '';

    if (editor.selection) {
      const selection = window.getSelection();
      if (selection) {
        tex = selection.toString();
      }
    }
    Transforms.insertNodes(
      editor,
      {
        type: inlineType,
        tex: tex,
        children: [{ text: '' }],
      },
      options,
    );
  };

  const turnIntoInlineEquation: TurnInto = (editor, options) => {
    let tex = '';
    if (editor.selection) {
      const selection = window.getSelection();
      if (selection) {
        tex = selection.toString();
      }
    }

    Transforms.wrapNodes(
      editor,
      {
        type: inlineType,
        tex,
        children: [{ text: '' }],
      },
      { split: true, ...options },
    );
  };

  const insertBlockEquation: Insert = (editor, options) => {
    Transforms.insertNodes(
      editor,
      {
        type: blockType,
        tex: '',
        children: [{ text: '' }],
      },
      options,
    );
  };

  const turnIntoBlockEquation: TurnInto = (editor, element, options): void => {
    Transforms.setNodes(
      editor,
      {
        type: blockType,
        tex: Node.string(element),
        children: [{ text: '' }],
      },
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
        component: BlockEquation,
        type: blockType,
        shortcuts: ['$$$ '],
        insert: insertBlockEquation,
        turnInto: turnIntoBlockEquation,
        ...(options.block || {}),
      },
      {
        isVoid: true,
        isInline: true,
        component: InlineEquationPlaceholder,
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
