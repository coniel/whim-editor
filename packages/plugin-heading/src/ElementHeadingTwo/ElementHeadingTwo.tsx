import React from 'react';
import { RenderElementProps, useUI } from '@sheets-editor/core';

export type ElementHeadingTwoProps = RenderElementProps;

const ElementHeadingTwo: React.FC<ElementHeadingTwoProps> = ({
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
        fontSize: '1.5em',
        lineHeight: '1.3',
        marginTop: '0.7em',
        marginBottom: 4,
      }}
      {...attributes}
    >
      <PlaceholderText text="Heading 2" element={element} />
      {children}
    </div>
  );
};

export default ElementHeadingTwo;
