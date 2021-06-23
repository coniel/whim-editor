import { Element } from '@braindrop-editor/core';

export interface ToDoListElementProperties {
  done: boolean;
}

export type ToDoListElement = Element<string, ToDoListElementProperties>;
