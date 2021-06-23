import React from 'react';
import { Editor } from 'slate';
import { RenderLeafProps } from 'slate-react';
import {
  SlashEditor,
  SlashPlugin,
  SlashPluginFactory,
  MarkShortcut,
  MarkedText,
  DeserializeMarkValue,
} from '@sheets-editor/core';
import onDOMBeforeInputRichText from './onDOMBeforeInputRichText';
import StrikeThrough from './RichTextStrikeThrough';

export type RichTextFormat = 'bold' | 'italic' | 'underline' | 'strike-through';

export interface EditorWithRichTextPlugin extends SlashEditor {
  addRichTextFormat: (mark: RichTextFormat) => void;
  removeRichTextFormat: (mark: RichTextFormat) => void;
  toggleRichTextFormat: (mark: RichTextFormat) => void;
  isRichTextFormatActive: (mark: RichTextFormat) => boolean;
}

export type IsMarkActive = (format: RichTextFormat) => boolean;

export type RichTextHotkeys = {
  [key in RichTextFormat]: string | false;
};

export type RichTextShortcuts = {
  [key in RichTextFormat]: MarkShortcut[] | false;
};

export type RichTextMarks = {
  [key in RichTextFormat]: string;
};

export type RichTextComponents = {
  [key in RichTextFormat]: React.ComponentType<RenderLeafProps> | string;
};

export interface RichTextPluginConfig {
  hotkeys?: Partial<RichTextHotkeys>;
  shortcuts?: Partial<RichTextShortcuts>;
  marks?: Partial<RichTextMarks>;
  components?: Partial<RichTextComponents>;
  formats?: RichTextFormat[];
}

const createRichTextPlugin = (
  config: RichTextPluginConfig = {},
): SlashPluginFactory => {
  const hotkeys = config.hotkeys || {};
  const shortcuts = config.shortcuts || {};
  const marks = config.marks || {};
  const components = config.components || {};
  const FORMATS = config.formats || [
    'bold',
    'italic',
    'underline',
    'strike-through',
  ];

  const MARKS: RichTextMarks = {
    bold: marks.bold || 'b',
    italic: marks.italic || 'i',
    underline: marks.underline || 'u',
    'strike-through': marks['strike-through'] || 's',
  };

  const HOTKEYS: RichTextHotkeys = {
    bold: typeof hotkeys.bold !== 'undefined' ? hotkeys.bold : 'mod+b',
    italic: typeof hotkeys.italic !== 'undefined' ? hotkeys.italic : 'mod+i',
    underline:
      typeof hotkeys.underline !== 'undefined' ? hotkeys.underline : 'mod+u',
    'strike-through':
      typeof hotkeys['strike-through'] !== 'undefined'
        ? hotkeys['strike-through']
        : 'mod+Shift+s',
  };

  const SHORTCUTS: RichTextShortcuts = {
    bold:
      typeof shortcuts.bold !== 'undefined'
        ? shortcuts.bold
        : [
            { start: '**', end: '**' },
            { start: '__', end: '__' },
          ],
    italic:
      typeof shortcuts.italic !== 'undefined'
        ? shortcuts.italic
        : [
            { start: '*', end: '*' },
            { start: '_', end: '_' },
          ],
    underline:
      typeof shortcuts.underline !== 'undefined' ? shortcuts.underline : false,
    'strike-through':
      typeof shortcuts['strike-through'] !== 'undefined'
        ? shortcuts['strike-through']
        : [{ start: '~', end: '~' }],
  };

  const COMPONENTS: RichTextComponents = {
    bold: components.bold || 'strong',
    italic: components.italic || 'em',
    underline: components.underline || 'u',
    'strike-through': components['strike-through'] || StrikeThrough,
  };

  return (editor: SlashEditor): SlashPlugin => {
    function isRichTextFormatActive(format: RichTextFormat): boolean {
      const marks = Editor.marks(editor);
      return marks ? (marks as MarkedText)[MARKS[format]] === true : false;
    }

    function addRichTextFormat(format: RichTextFormat): void {
      const mark = MARKS[format];

      Editor.addMark(editor, mark, true);
    }

    function removeRichTextFormat(format: RichTextFormat): void {
      const mark = MARKS[format];

      Editor.removeMark(editor, mark);
    }

    function toggleRichTextFormat(format: RichTextFormat): void {
      const isActive = isRichTextFormatActive(format);

      if (isActive) {
        removeRichTextFormat(format);
      } else {
        addRichTextFormat(format);
      }
    }

    const richTextEditor = editor as EditorWithRichTextPlugin;

    richTextEditor.isRichTextFormatActive = isRichTextFormatActive;
    richTextEditor.addRichTextFormat = addRichTextFormat;
    richTextEditor.removeRichTextFormat = removeRichTextFormat;
    richTextEditor.toggleRichTextFormat = toggleRichTextFormat;
    const boldLeaf = { [MARKS.bold]: true };
    const italicLeaf = { [MARKS.italic]: true };
    const underlineLeaf = { [MARKS.underline]: true };
    const strikeThroughLeaf = { [MARKS['strike-through']]: true };

    return {
      leaves: FORMATS.map((format) => ({
        component: COMPONENTS[format],
        mark: MARKS[format],
        hotkeys: HOTKEYS[format] ? [HOTKEYS[format] as string] : [],
        shortcuts: SHORTCUTS[format]
          ? (SHORTCUTS[format] as MarkShortcut[])
          : [],
      })),
      markDeserializers: {
        '*': (el): DeserializeMarkValue => {
          if (!el.style) {
            return;
          }

          if (
            ['600', '700', '800', '900', 'bold'].includes(el.style.fontWeight)
          ) {
            return boldLeaf;
          }
          if (['italic', 'oblique'].includes(el.style.fontStyle)) {
            return italicLeaf;
          }
          if (['line-through'].includes(el.style.textDecoration)) {
            return strikeThroughLeaf;
          }
          if (['line-through'].includes(el.style.textDecorationLine)) {
            return strikeThroughLeaf;
          }
          if (['underline'].includes(el.style.textDecoration)) {
            return underlineLeaf;
          }
          if (['underline'].includes(el.style.textDecorationLine)) {
            return underlineLeaf;
          }
        },
        STRONG: (): DeserializeMarkValue => boldLeaf,
        B: (): DeserializeMarkValue => {
          return boldLeaf;
        },
        DL: (): DeserializeMarkValue => {
          return boldLeaf;
        },
        EM: (): DeserializeMarkValue => {
          return italicLeaf;
        },
        I: (): DeserializeMarkValue => {
          return italicLeaf;
        },
        DEL: (): DeserializeMarkValue => {
          return strikeThroughLeaf;
        },
        INS: (): DeserializeMarkValue => {
          return underlineLeaf;
        },
        U: (): DeserializeMarkValue => {
          return underlineLeaf;
        },
      },
      // When a user right clicks on selected text
      // they can apply formatting through the OS's
      // context menu which is hanled here.
      onDOMBeforeInput: (event): void =>
        onDOMBeforeInputRichText(richTextEditor, event),
    };
  };
};

export default createRichTextPlugin;
