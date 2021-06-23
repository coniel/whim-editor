import { BaseElement, Element as SlateElement } from 'slate';

// eslint-disable-next-line @typescript-eslint/ban-types
export interface Element<Type = string, Properties = {}> extends BaseElement {
  type: Type;
  properties: Properties;
  id: string;
}

export const Element = SlateElement;
