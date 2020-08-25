import { Ancestor, Editor, Node } from 'slate';

/**
 * Is an ancestor empty (empty text and no inline children).
 */
export const isAncestorEmpty = (editor: Editor, node: Ancestor): boolean =>
  !Node.string(node) && !node.children.some((n) => Editor.isInline(editor, n));
