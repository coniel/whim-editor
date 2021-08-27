import { Element } from '../../types';

export function generateElement<P = Record<string, unknown>>(
  type: string,
  id: string,
  properties: P,
): Element {
  const element: Element = {
    type,
    id,
    children: [{ text: '' }],
    ...properties,
  };

  return element;
}
