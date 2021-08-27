import { ElementWithProperties, BraindropEditor } from '@braindrop-editor/core';

export interface LinkElementProperties {
  url: string;
}

export type LinkElement = ElementWithProperties<string, LinkElementProperties>;

export interface EditorWithLinkPlugin extends BraindropEditor {
  insertLink: (url: string) => void;
  removeLink: () => void;
  openLinkPopover: () => void;
  linkPopover?: boolean;
}
