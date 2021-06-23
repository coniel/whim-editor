import React, { useEffect, useState } from 'react';
import { useBlockPlugin } from '../BlockPluginProvider';

export interface ElementBlockProps {
  id: string;
}

const Overlay: React.FC = () => {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setOpacity(1);
    });
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        transition: 'opacity 0.2s linear',
        top: 0,
        right: -2,
        bottom: 0,
        left: -2,
        pointerEvents: 'none',
        backgroundColor: 'rgba(46, 170, 220, 0.2)',
        opacity,
      }}
    />
  );
};

export const ElementBlock: React.FC<ElementBlockProps> = ({ children, id }) => {
  const { selectedBlocks, isDragging } = useBlockPlugin();
  return (
    <div>
      {children}
      {!isDragging && selectedBlocks.find((block) => block.id === id) && (
        <Overlay />
      )}
    </div>
  );
};
