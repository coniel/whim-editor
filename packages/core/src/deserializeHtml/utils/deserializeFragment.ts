import { Descendant, Node } from 'slate';
import { jsx } from 'slate-hyperscript';

export function deserializeFragment({
  el,
  children,
}: {
  el: HTMLElement;
  children: (Node | null)[];
}): Descendant[] | undefined {
  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }
}
