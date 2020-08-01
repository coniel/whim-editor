import React from 'react';
import { RenderElementProps } from 'slate-react';

export interface ElementHeadingTwoProps extends RenderElementProps {
  foo?: string;
}

const ElementHeadingTwo: React.FC<ElementHeadingTwoProps> = ({
  attributes,
  children,
}) => {
  return (
    <h2
      style={{
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
      {children}
    </h2>
  );
};

export default ElementHeadingTwo;
