import React from 'react';
import { RenderElementProps } from '@sheets-editor/editor';

export interface ElementHeadingOneProps extends RenderElementProps {
  foo?: string;
}

const ElementHeadingOne: React.FC<ElementHeadingOneProps> = ({
  attributes,
  children,
}) => {
  return (
    <h1
      style={{
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
      {children}
    </h1>
  );
};

export default ElementHeadingOne;
