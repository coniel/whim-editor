import React from 'react';
import { Node, Element, Range } from 'slate';
import { PlaceholderTextProps } from '@sheets-editor/core';
import { useEditor, useSelected } from 'slate-react';

export const PlaceholderText: React.FC<PlaceholderTextProps> = ({
  text,
  element,
  onlyWhenFocused,
}) => {
  const editor = useEditor();
  const selected = useSelected();
  const hasContent =
    (element as Element).children.length > 1 || Node.string(element).length > 0;

  if (
    hasContent ||
    (onlyWhenFocused &&
      (!selected || !editor.selection || !Range.isCollapsed(editor.selection)))
  ) {
    return null;
  }

  return (
    <span
      contentEditable={false}
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
        display: 'inline-block',
        width: 0,
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        opacity: 0.25,
        position: 'absolute',
      }}
    >
      {text}
    </span>
  );
};
