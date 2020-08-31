import React from 'react';
import { RenderLeafProps } from '@sheets-editor/core';

export type LeafCodeProps = RenderLeafProps;

const LeafCode: React.FC<LeafCodeProps> = ({ attributes, children }) => {
  return (
    <code
      style={{
        borderRadius: 3,
        backgroundColor: '#EDEDEB',
        color: '#EB5857',
        fontSize: '85%',
        padding: '0.2em 0.4em',
      }}
      {...attributes}
    >
      {children}
    </code>
  );
};

export default LeafCode;
