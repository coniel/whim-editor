import React from 'react';
import { Node } from 'slate';
import { RenderElementProps } from '@sheets-editor/core';

export type ElementBlockquoteProps = RenderElementProps;

const ElementBlockquote: React.FC<ElementBlockquoteProps> = ({
  attributes,
  children,
  element,
}) => {
  const texts = Array.from(Node.texts(element));
  const hasContent = texts.length > 1 || texts[0][0].text.length > 0;

  return (
    <blockquote
      style={{
        maxWidth: '100%',
        width: '100%',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        caretColor: 'inherit',
        color: 'inherit',
        fontSize: '1.2em',
        lineHeight: '1.3',
        marginBottom: 4,
        margin: 0,
        paddingLeft: '0.9em',
        paddingRight: '0.9em',
        borderLeft: '3px solid currentcolor',
      }}
      {...attributes}
    >
      {!hasContent && (
        <span
          contentEditable={false}
          style={{
            pointerEvents: 'none',
            display: 'inline-block',
            width: 0,
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            opacity: 0.25,
          }}
        >
          Empty quote
        </span>
      )}
      {children}
    </blockquote>
  );
};

export default ElementBlockquote;
