import { BaseElement, Element as SlateElement } from 'slate';

// eslint-disable-next-line @typescript-eslint/ban-types
export interface BasicElement<Type = string> extends BaseElement {
  type: Type;
  id: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface ElementWithProperties<Type = string, Properties = {}>
  extends BaseElement {
  type: Type;
  id: string;
  properties: Properties;
}

export type Element = BasicElement | ElementWithProperties;

export const Element = SlateElement;
