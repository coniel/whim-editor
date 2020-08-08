import React from 'react';
import { Range, Element, Text } from 'slate';
import { useBlockPlugin } from '../BlockPluginProvider';

const BlockPluginUI: React.FC = () => {
  const {
    isDragging,
    draggedBlock,
    mouse,
    ref,
    blocks,
    handleMouseDown,
    hoverBlock,
    handleClickInsertBlock,
    blockSelection,
    selectedBlocks,
  } = useBlockPlugin();

  return (
    <div>
      {isDragging && draggedBlock && mouse && (
        <div
          style={{
            position: 'fixed',
            opacity: 0.4,
            left: mouse.x || 0,
            top: mouse.y || 0,
            width: ref.current ? ref.current.clientWidth - 280 : 200,
          }}
        >
          {!selectedBlocks.length &&
            ((draggedBlock as Element).children[0] as Text).text}
          {selectedBlocks.length &&
            selectedBlocks.map((block) => (
              <div key={block.id as string}>
                {((block as Element).children[0] as Text).text}
              </div>
            ))}
        </div>
      )}
      {isDragging &&
        hoverBlock &&
        draggedBlock !== hoverBlock &&
        (!blockSelection ||
          !Range.includes(blockSelection, hoverBlock.path)) && (
          <div
            style={{
              position: 'fixed',
              left: hoverBlock.rect.left,
              width: hoverBlock.rect.width,
              top: hoverBlock.rect.top + hoverBlock.rect.height - 4,
              borderBottom: '4px solid rgba(46, 170, 220, 0.5)',
            }}
          />
        )}
      {blocks.map((block) => {
        if (!isDragging && hoverBlock && block.id === hoverBlock.id) {
          return (
            <div
              key={`drag-handle-${block.id}`}
              onMouseDown={handleMouseDown}
              role="button"
              className="drag-handle"
              style={{
                position: 'fixed',
                top: block.rect.top + 7,
                left: block.rect.left - 38,
                cursor: 'grab',
                userSelect: 'none',
                display: 'flex',
              }}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={handleClickInsertBlock}
                style={{
                  userSelect: 'none',
                  cursor: 'pointer',
                  fill: 'rgba(55, 53, 47, 0.3)',
                  marginRight: 4,
                }}
              >
                <svg
                  viewBox="0 0 18 18"
                  className="plus"
                  style={{ width: 16, height: '100%', fill: 'inherit' }}
                >
                  <polygon points="17,8 10,8 10,1 8,1 8,8 1,8 1,10 8,10 8,17 10,17 10,10 17,10 "></polygon>
                </svg>
              </div>
              <div
                role="button"
                tabIndex={0}
                style={{
                  userSelect: 'none',
                  fill: 'rgba(55, 53, 47, 0.3)',
                }}
              >
                <svg
                  viewBox="0 0 10 10"
                  className="dragHandle"
                  style={{ width: 14, height: '100%', fill: '#C3C2C0' }}
                >
                  <path d="M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z"></path>
                </svg>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default BlockPluginUI;
