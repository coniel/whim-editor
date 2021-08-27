import {
  BraindropEditor,
  Element,
  InsertOptions,
  Range,
  Text,
  TurnIntoOptions,
} from '@braindrop-editor/core';

export interface CodeElementProperties {
  language: string;
}

export type CodeElement = Element & CodeElementProperties;

export interface CodeLeaf extends Text {
  code: boolean;
}

export interface CodeText extends Text {
  decorateCode: boolean;
  token: string;
}

export interface EditorWithCodePlugin extends BraindropEditor {
  insertCodeElement: (options?: InsertOptions) => void;
  turnIntoCodeElement: (element: Element, options?: TurnIntoOptions) => void;
}

export interface CodeRange extends Range {
  decorateCode: boolean;
  token: string;
}
