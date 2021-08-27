import { ElementWithProperties } from '@braindrop-editor/core';

export interface EquationElementProperties {
  expression: string;
}

export type InlineEquationElement = ElementWithProperties<
  string,
  EquationElementProperties
>;

export type BlockEquationElement = ElementWithProperties<
  string,
  EquationElementProperties
>;
