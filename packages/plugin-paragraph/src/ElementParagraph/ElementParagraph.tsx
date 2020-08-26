import React from 'react';
import { RenderElementProps } from '@sheets-editor/core';

export interface ElementParagraphProps extends RenderElementProps {
  foo?: string;
}

const ElementParagraph: React.FC<ElementParagraphProps> = ({
  attributes,
  children,
}) => {
  return (
    <p
      style={{
        fontSize: '16px',
        lineHeight: 1.5,
        padding: '3px 0',
        margin: '1px 0',
      }}
      {...attributes}
    >
      {children}
    </p>
  );
};

export default ElementParagraph;
