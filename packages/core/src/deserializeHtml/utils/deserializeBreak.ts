export default (node: HTMLElement | ChildNode): string | null =>
  node.nodeName === 'BR' ? '\n' : null;
