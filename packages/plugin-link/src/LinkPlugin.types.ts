import { Element, SlashEditor } from '@sheets-editor/core';

export interface LinkElement extends Element {
  url?: string;
}

export interface EditorWithLinkPlugin extends SlashEditor {
  insertLink: (url: string) => void;
}
