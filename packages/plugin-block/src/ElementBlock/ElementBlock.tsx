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
        transition: 'opacity 0.18s linear',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
        backgroundColor: 'rgba(46, 170, 220, 0.2)',
        opacity,
      }}
    />
  );
};

const ElementBlock: React.FC<ElementBlockProps> = ({ children, id }) => {
  const { selectedBlocks, isDragging } = useBlockPlugin();
  return (
    <div
      style={{
        position: 'relative',
        margin: '2px 0',
        padding: '3px 2px',
      }}
    >
      {/* <div
        style={{ background: 'blue', color: '#FFF' }}
        contentEditable={false}
      >
        {id}
      </div> */}
      {children}
      {!isDragging && selectedBlocks.find((block) => block.id === id) && (
        <Overlay />
      )}
    </div>
  );
};

export default ElementBlock;
