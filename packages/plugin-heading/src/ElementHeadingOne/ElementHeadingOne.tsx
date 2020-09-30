import React from 'react';
import { RenderElementProps, useUI } from '@sheets-editor/core';

export type ElementHeadingOneProps = RenderElementProps;

const ElementHeadingOne: React.FC<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  const { PlaceholderText } = useUI();

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: '100%',
        width: '100%',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        caretColor: 'inherit',
        color: 'inherit',
        fontWeight: 600,
        fontSize: '1.875em',
        lineHeight: '1.3',
        marginTop: '1em',
        marginBottom: 4,
      }}
      {...attributes}
    >
      <PlaceholderText text="Heading 1" element={element} />
      {children}
    </div>
  );
};

export default ElementHeadingOne;
