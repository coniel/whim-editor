import { BaseElement, Element as SlateElement } from 'slate';

export interface Element extends BaseElement {
  type: string;
  id: string;
}

export const Element = SlateElement;
