import { Editor, Element } from 'slate';
import { getBlockAbove } from './getBlockAbove';
import { isAncestorEmpty } from './isAncestorEmpty';

/**
 * Is the block above the selection empty.
 */
export const isBlockAboveEmpty = (editor: Editor): boolean => {
  const blockEntry = getBlockAbove(editor);
  const [block] = blockEntry;
  return (
    Element.isElement(block) &&
    !editor.isVoid(block) &&
    isAncestorEmpty(editor, block)
  );
};
