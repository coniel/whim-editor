import { ElementDeserializers } from '../../withPlugins';
import { Element, Node } from 'slate';
import { jsx } from 'slate-hyperscript';

export default ({
  elementDeserializers,
  el,
  children,
}: {
  elementDeserializers: ElementDeserializers;
  el: HTMLElement;
  children: (Node | null)[];
}): Element | undefined => {
  const type = el.getAttribute('data-slate-type') || el.nodeName;

  if (elementDeserializers[type]) {
    const attrs = elementDeserializers[type](el);

    return jsx('element', attrs, children);
  }
};
