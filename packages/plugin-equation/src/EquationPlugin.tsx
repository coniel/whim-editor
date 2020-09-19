import {
  SlashPluginFactory,
  SlashPlugin,
  SlashEditor,
  SlashPluginElementDescriptor,
} from '@sheets-editor/core';
import { Transforms, Element, Node } from 'slate';
import 'katex/dist/katex.min.css';
import 'katex/dist/contrib/mhchem.js';
import InlineEquationPlaceholder from './ElementEquationInline';
import BlockEquation from './ElementEquationBlock';

export interface SlashEditorWithEquation extends SlashEditor {
  insertInlineEquation: () => void;
  insertBlockEquation: () => void;
  turnIntoInlineEquation: (editor: SlashEditor, element: Element) => void;
  turnIntoBlockEquation: (editor: SlashEditor, element: Element) => void;
}

export interface EquationPluginOptions {
  block?: Partial<SlashPluginElementDescriptor>;
  inline?: Partial<SlashPluginElementDescriptor>;
}

const EquationPlugin = (
  options: EquationPluginOptions = {},
): SlashPluginFactory => (editor: SlashEditor): SlashPlugin => {
  const equationEditor = editor as SlashEditorWithEquation;

  const insertInlineEquation = (): void => {
    let tex = '';

    if (editor.selection) {
      const selection = window.getSelection();
      if (selection) {
        tex = selection.toString();
      }
    }
    Transforms.insertNodes(editor, {
      type: 'equation-inline',
      tex: tex,
      children: [{ text: '' }],
    });
  };

  const turnIntoInlineEquation = (): void => {
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
        type: 'equation-inline',
        tex,
        children: [{ text: '' }],
      },
      { split: true },
    );
  };

  const insertBlockEquation = (): void => {
    Transforms.insertNodes(editor, {
      type: 'equation',
      tex: '',
      children: [{ text: '' }],
    });
  };

  const turnIntoBlockEquation = (
    editor: SlashEditor,
    element: Element,
  ): void => {
    Transforms.setNodes(editor, {
      type: 'equation',
      tex: Node.string(element),
    });
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
        type: 'equation',
        shortcuts: ['$$$ '],
        insert: insertBlockEquation,
        turnInto: turnIntoBlockEquation,
        ...(options.block || {}),
      },
      {
        isVoid: true,
        isInline: true,
        component: InlineEquationPlaceholder,
        type: 'equation-inline',
        hotkeys: ['mod+Shift+e'],
        insert: insertInlineEquation,
        turnInto: turnIntoInlineEquation,
        ...(options.inline || {}),
      },
    ],
  };
};

export default EquationPlugin;
