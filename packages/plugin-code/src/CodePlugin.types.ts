import { BraindropEditor, Element, MarkedText } from '@sheets-editor/core';
import { BaseRange, BaseText } from 'slate';

export interface CodeElement extends Element {
  language: string;
}

export interface CodeLeaf extends MarkedText {
  code: boolean;
}

export interface CodeText extends BaseText {
  decorateCode: boolean;
  token: string;
}

type CodeChildren = BraindropEditor['children'] & CodeElement;

export interface EditorWithCodePlugin extends BraindropEditor {
  children: CodeChildren;
}

export interface CodeRange extends BaseRange {
  decorateCode: boolean;
  token: string;
}
