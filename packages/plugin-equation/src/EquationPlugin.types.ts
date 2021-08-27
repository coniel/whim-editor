import { Element } from '@braindrop-editor/core';

export interface EquationElementProperties {
  expression: string;
}

export type InlineEquationElement = Element & EquationElementProperties;

export type BlockEquationElement = Element & EquationElementProperties;
