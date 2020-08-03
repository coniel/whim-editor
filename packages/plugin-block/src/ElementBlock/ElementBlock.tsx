import React from 'react';
import { useBlockPlugin } from '../BlockPluginProvider';

export interface ElementBlockProps {
  id: string;
}

const ElementBlock: React.FC<ElementBlockProps> = ({ children, id }) => {
  const { selectedBlocks } = useBlockPlugin();
  return (
    <div
      style={{
        position: 'relative',
        margin: '2px 0',
        padding: '3px 2px',
      }}
    >
      {children}
      {selectedBlocks.find((block) => block.id === id) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            pointerEvents: 'none',
            backgroundColor: 'rgba(46, 170, 220, 0.2)',
          }}
        />
      )}
    </div>
  );
};

export default ElementBlock;
