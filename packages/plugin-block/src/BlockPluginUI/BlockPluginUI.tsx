import React from 'react';
import { Range, Element, Text, Transforms, Path } from 'slate';
import { useUI } from '@braindrop-editor/core';
import { useBlockPlugin } from '../BlockPluginProvider';
import { useSlateStatic } from 'slate-react';

export const BlockPluginUI: React.FC = () => {
  const editor = useSlateStatic();
  const { Popover, List, MenuItem, MenuDivider, TextField } = useUI();
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
    contextMenu,
    closeContextMenu,
  } = useBlockPlugin();

  function handleClickDelete(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (selectedBlocks.length) {
      [...selectedBlocks].reverse().forEach((block) => {
        Transforms.removeNodes(editor, {
          at: block.path as Path,
        });
      });
    }
    closeContextMenu();
  }

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
      <Popover
        open={!!contextMenu}
        onClose={closeContextMenu}
        anchorReference="anchorPosition"
        // anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        anchorPosition={
          contextMenu
            ? { top: contextMenu.y, left: contextMenu.x }
            : { top: -1000, left: -1000 }
        }
      >
        <div style={{ width: 220, height: 380 }}>
          <TextField
            placeholder="Filter actions..."
            style={{ width: 'calc(100% - 32px)', margin: 16, marginBottom: 8 }}
          />
          <List>
            <MenuItem
              primaryText="Delete"
              shortcut="Del"
              onClick={handleClickDelete}
            />
            <MenuItem
              primaryText="Duplicate"
              shortcut="⌘+D"
              onClick={handleClickDelete}
            />
            <MenuItem primaryText="Turn into" onClick={handleClickDelete} />
            <MenuItem primaryText="Copy link" onClick={handleClickDelete} />
            <MenuDivider />
            <MenuItem
              primaryText="Create template"
              shortcut="⌘+Shift+T"
              onClick={handleClickDelete}
            />
            <MenuDivider />
            <MenuItem
              primaryText="Comment"
              shortcut="⌘+Shift+M"
              onClick={handleClickDelete}
            />
            <MenuDivider />
            <MenuItem primaryText="Color" onClick={handleClickDelete} />
          </List>
        </div>
      </Popover>
    </div>
  );
};
