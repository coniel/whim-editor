import React from 'react';
import { RenderElementProps, useUI } from '@sheets-editor/core';

export type ElementHeadingThreeProps = RenderElementProps;

const ElementHeadingThree: React.FC<ElementHeadingThreeProps> = ({
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
        fontSize: '1.25em',
        lineHeight: '1.3',
        marginTop: '0.5em',
        marginBottom: 4,
        padding: '3px 0',
      }}
      {...attributes}
    >
      <PlaceholderText text="Heading 3" element={element} />
      {children}
    </div>
  );
};

export default ElementHeadingThree;
