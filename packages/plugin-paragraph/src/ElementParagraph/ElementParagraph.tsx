import React from 'react';
import { RenderElementProps, useUI } from '@sheets-editor/core';

export interface ElementParagraphProps extends RenderElementProps {
  foo?: string;
}

const ElementParagraph: React.FC<ElementParagraphProps> = ({
  attributes,
  children,
  element,
}) => {
  const { PlaceholderText } = useUI();
  return (
    <div
      style={{
        position: 'relative',
        fontSize: '16px',
        lineHeight: 1.5,
        padding: '3px 0',
        margin: '2px 0',
      }}
      {...attributes}
    >
      <PlaceholderText
        onlyWhenFocused
        text="Type '/' for commands"
        element={element}
      />
      {children}
    </div>
  );
};

export default ElementParagraph;
