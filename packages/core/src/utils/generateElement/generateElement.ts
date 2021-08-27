import { Element, ElementWithProperties } from '../../types';

export function generateElement(
  type: string,
  id: string,
  properties?: Record<string, unknown>,
): Element | ElementWithProperties {
  const element: Element = {
    type,
    id,
    children: [{ text: '' }],
  };

  if (properties) {
    (element as ElementWithProperties).properties = properties;
  }

  return element;
}
