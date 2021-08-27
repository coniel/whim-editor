import { ElementWithProperties } from '@braindrop-editor/core';

export interface ToDoListElementProperties {
  done: boolean;
}

export type ToDoListElement = ElementWithProperties<
  string,
  ToDoListElementProperties
>;
