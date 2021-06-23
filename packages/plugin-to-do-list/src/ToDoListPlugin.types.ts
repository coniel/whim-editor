import { Element } from '@sheets-editor/core';

export interface ToDoListElementProperties {
  done: boolean;
}

export type ToDoListElement = Element<string, ToDoListElementProperties>;
