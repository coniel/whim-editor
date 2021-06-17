import { Element } from '@sheets-editor/core';

export interface InlineEquationElement extends Element {
  tex: string;
}

export interface BlockEquationElement extends Element {
  tex: string;
}
