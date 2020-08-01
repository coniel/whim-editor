import React from 'react';
import { RenderElementProps } from 'slate-react';

export interface ElementHeadingThreeProps extends RenderElementProps {
  foo?: string;
}

const ElementHeadingThree: React.FC<ElementHeadingThreeProps> = ({
  attributes,
  children,
}) => {
  return (
    <h3
      style={{
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
      }}
      {...attributes}
    >
      {children}
    </h3>
  );
};

export default ElementHeadingThree;
