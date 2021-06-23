import { Element } from '@sheets-editor/core';

export interface OrderedListElementProperties {
  number: number;
}

export type OrderedListElement = Element<string, OrderedListElementProperties>;
