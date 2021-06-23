import { Element, BraindropEditor } from '@braindrop-editor/core';

export interface LinkElementProperties {
  url: string;
}

export type LinkElement = Element<string, LinkElementProperties>;

export interface EditorWithLinkPlugin extends BraindropEditor {
  insertLink: (url: string) => void;
  removeLink: () => void;
  openLinkPopover: () => void;
  linkPopover?: boolean;
}
