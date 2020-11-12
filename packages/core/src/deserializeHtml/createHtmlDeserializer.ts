import { jsx } from 'slate-hyperscript';
import { Text } from 'slate';
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
  parent: HTMLElement | ChildNode | null,
  elementDeserializers: ElementDeserializers[],
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

  const children = Array.from(node.childNodes)
    .map((childNode) =>
      deserializeHtml(childNode, node, elementDeserializers, markDeserializers),
    )
    .flat();

  const el = node as HTMLElement;

  // body
  const fragment = deserializeFragment({ el, children });
  if (fragment) return fragment;

  // element
  const element = deserializeElement({
    elementDeserializers,
    el,
    parent: parent as HTMLElement | null,
    children,
  });

  if (element) return element;

  // mark
  if (parent && parent.nodeName !== 'BODY') {
    const texts = deserializeMark({
      deserializers: markDeserializers,
      el,
      children,
    });
    if (texts) return texts;
  }

  // if (parent && parent.nodeName === 'BODY') {
  //   // return children.map((child) => {
  //   //   // if (
  //   //   //   // Ignore non-breaking spaces
  //   //   //   (typeof child === 'string' && child !== '\u00a0') ||
  //   //   //   (Text.isText(child) && child.text !== '\u00a0')
  //   //   // ) {
  //   //   // }
  //   // });
  //   return jsx('element', { type: 'paragraph' }, children);
  // }

  return children;
};

export default deserializeHtml;
