import { Element } from '@sheets-editor/core';

export interface EquationElementProperties {
  expression: string;
}

export type InlineEquationElement = Element<string, EquationElementProperties>;

export type BlockEquationElement = Element<string, EquationElementProperties>;
