export function deserializeBreak(node: HTMLElement | ChildNode): string | null {
  return node.nodeName === 'BR' ? '\n' : null;
}
