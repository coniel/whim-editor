import { BraindropEditor, Element, Range, Text } from '@braindrop-editor/core';

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

type CodeChildren = BraindropEditor['children'] & CodeElement;

export interface EditorWithCodePlugin extends BraindropEditor {
  children: CodeChildren;
}

export interface CodeRange extends Range {
  decorateCode: boolean;
  token: string;
}
