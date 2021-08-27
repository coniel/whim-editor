import { ElementWithProperties } from '@braindrop-editor/core';

export interface OrderedListElementProperties {
  number: number;
}

export type OrderedListElement = ElementWithProperties<
  string,
  OrderedListElementProperties
>;
