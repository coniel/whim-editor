import {
  ElementDeserializers,
  ElementDeserializer,
  DeserializeElementValue,
} from '../../withPlugins';
import { Element, Node } from 'slate';
import { jsx } from 'slate-hyperscript';

export interface DeserializeElementData {
  elementDeserializers: ElementDeserializers[];
  el: HTMLElement;
  parent: HTMLElement | null;
  children: (Node | DeserializeElementValue | null)[];
}

export function deserialize(
  deserializerFn: ElementDeserializer,
  data: DeserializeElementData,
): Element | Element[] | null {
  const { el, parent, children } = data;
  const attrs = deserializerFn(el, children, parent);

  if (Array.isArray(attrs)) {
    return attrs.map((childAttr) =>
      jsx('element', childAttr, childAttr.children),
    );
  } else if (attrs) {
    return jsx('element', attrs, children);
  }

  return null;
}

export function deserializeElement(
  data: DeserializeElementData,
): Element | Element[] | undefined {
  const { elementDeserializers, el } = data;
  const type = el.getAttribute('data-slate-type') || el.nodeName;

  let element: Element | Element[] | null = null;

  const deserializers = elementDeserializers.filter(
    (deserializer) => !!deserializer[type],
  );

  deserializers.forEach((deserializer) => {
    if (!element) {
      const deserializerFn = deserializer[type];
      element = deserialize(deserializerFn, data);
    }
  });

  if (!element) {
    const wildcardDeserializers = elementDeserializers.filter(
      (deserializer) => !!deserializer['*'],
    );

    wildcardDeserializers.forEach((deserializer) => {
      if (!element) {
        const deserializerFn = deserializer['*'];
        element = deserialize(deserializerFn, data);
      }
    });
  }

  if (element) {
    return element;
  }
}
