import deserializeTextNode from './utils/deserializeTextNode';
import deserializeBreak from './utils/deserializeBreak';
import deserializeFragment from './utils/deserializeFragment';
import deserializeElement from './utils/deserializeElement';
import deserializeMark from './utils/deseralizeMark';
import {
  ElementDeserializers,
  CombinedMarkDeserializers,
} from '../withPlugins';

const deserializeHtml = (
  node: HTMLElement | ChildNode,
  elementDeserializers: ElementDeserializers,
  markDeserializers: CombinedMarkDeserializers,
): any => {
  // text node
  const textNode = deserializeTextNode(node);
  if (textNode) return textNode;

  // if not an element node
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  // break line
  const breakLine = deserializeBreak(node);
  if (breakLine) return breakLine;

  const parent = node;

  const children = Array.from(parent.childNodes)
    .map((childNode) =>
      deserializeHtml(childNode, elementDeserializers, markDeserializers),
    )
    .flat();

  const el = node as HTMLElement;

  // body
  const fragment = deserializeFragment({ el, children });
  if (fragment) return fragment;

  // element
  const element = deserializeElement({ elementDeserializers, el, children });
  if (element) return element;

  // mark
  const texts = deserializeMark({
    deserializers: markDeserializers,
    el,
    children,
  });
  if (texts) return texts;

  return children;
};

export default deserializeHtml;
