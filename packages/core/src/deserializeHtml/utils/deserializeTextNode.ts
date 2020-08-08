const deserializeTextNode = (node: HTMLElement | ChildNode): string | null => {
  if (node.nodeType === Node.TEXT_NODE)
    return node.nodeValue === '\n' ? null : node.textContent;

  return null;
};

export default deserializeTextNode;
