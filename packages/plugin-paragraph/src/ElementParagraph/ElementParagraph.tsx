import React from 'react';
import { RenderElementProps } from '@braindrop-editor/core';

export type ElementParagraphProps = RenderElementProps;

export const ElementParagraph: React.FC<ElementParagraphProps> = ({
  attributes,
  children,
}) => {
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
      {children}
    </div>
  );
};
