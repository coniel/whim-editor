import React from 'react';
import { RenderElementProps, useUI } from '@sheets-editor/core';
import { BlockquoteElement } from '../BlockquotePlugin.types';

export type ElementBlockquoteProps = RenderElementProps<BlockquoteElement>;

export const ElementBlockquote: React.FC<ElementBlockquoteProps> = ({
  attributes,
  children,
  element,
}) => {
  const { PlaceholderText } = useUI();

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
      <PlaceholderText text="Empty quote" element={element} />
      {children}
    </blockquote>
  );
};
