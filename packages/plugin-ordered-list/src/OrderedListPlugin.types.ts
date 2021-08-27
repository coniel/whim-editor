import { Element } from '@braindrop-editor/core';

export interface OrderedListElementProperties {
  number: number;
}

export type OrderedListElement = Element & OrderedListElementProperties;
