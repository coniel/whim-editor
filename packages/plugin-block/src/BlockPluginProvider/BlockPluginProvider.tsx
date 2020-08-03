import React, { useState, useEffect, useCallback } from 'react';
import { Node, Range, Path, Point, Transforms } from 'slate';
import { createContext } from '@slash/editor';
import { useEditor, ReactEditor } from 'slate-react';

export interface Coordinates {
  x: number;
  y: number;
}

export interface BlockPosition {
  id: string | null;
  rect: DOMRect;
}

export interface BlockPluginContextValue {
  ref: React.RefObject<HTMLDivElement>;
  isDragging: boolean;
  draggedBlock: Node | null;
  handleMouseDown: (event: React.MouseEvent) => void;
  handleClickInsertBlock: (event: React.MouseEvent) => void;
  offset: Coordinates;
  mouse: Coordinates;
  hoverBlock: BlockPosition | null;
  blockPositions: BlockPosition[];
  value: Node[];
  selectedBlocks: Node[];
  selectAnchor: BlockPosition | null;
  selectFocus: BlockPosition | null;
}

function incrementPath(path: Path): void {
  const pathLast = path.length - 1;
  path[pathLast] += 1;
}

const [hook, Provider] = createContext<BlockPluginContextValue>();

const BlockPluginProvider: React.FC = ({ children }) => {
  const editor = useEditor();

  const ref = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<Node | null>(null);
  const [hoverBlock, setHoverBlock] = useState<{
    id: string | null;
    rect: DOMRect;
  } | null>(null);
  const [blockPositions, setBlockPositions] = useState<BlockPosition[]>([]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [selectingBlocks, setSelectingBlocks] = useState(false);
  const [selectAnchor, setSelectAnchor] = useState<BlockPosition | null>(null);
  const [selectFocus, setSelectFocus] = useState<BlockPosition | null>(null);
  const [blockSelection, setBlockSelection] = useState<Range | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<Node[]>([]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const body = document.body;
    const docEl = document.documentElement;
    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    const scrollLeft =
      window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    const clientTop = docEl.clientTop || body.clientTop || 0;
    const clientLeft = docEl.clientLeft || body.clientLeft || 0;
    setOffset({
      x: scrollLeft + clientLeft,
      y: scrollTop + clientTop,
    });
    setMouse({
      x: event.pageX - scrollLeft + clientLeft,
      y: event.pageY - scrollTop + clientTop,
    });
  }, []);

  useEffect(() => {
    const blocks = editor.children.map((child) =>
      ReactEditor.toDOMNode(editor, child),
    );
    const dimensions = [];
    let i;
    for (i = 0; i < blocks.length; i++) {
      dimensions.push({
        id: blocks[i].getAttribute('data-block-id'),
        rect: blocks[i].getBoundingClientRect(),
      });
    }

    setBlockPositions(dimensions);
  }, [editor.children]);

  useEffect(() => {
    const matches = blockPositions.filter(
      ({ rect }) => mouse.y && rect.top <= mouse.y && rect.bottom >= mouse.y,
    );
    const hBlock = matches[0] ? matches[0] : null;
    setHoverBlock(hBlock);

    if (selectAnchor && hBlock) {
      if (!selectingBlocks && selectAnchor.id !== hBlock.id) {
        setSelectingBlocks(true);
        ReactEditor.deselect(editor);
      }
    }
  }, [mouse, selectAnchor, selectingBlocks]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const startPos = { x: event.pageX, y: event.pageY };

      function handleMouseMoveDrag(event: MouseEvent): void {
        if (
          (event.pageX > startPos.x && event.pageX - startPos.x > 6) ||
          (event.pageX < startPos.x && startPos.x - event.pageX > 6) ||
          (event.pageY > startPos.y && event.pageY - startPos.y > 6) ||
          (event.pageY < startPos.y && startPos.y - event.pageY > 6)
        ) {
          setIsDragging(true);
          document.removeEventListener('mousemove', handleMouseMoveDrag);
        }
      }

      function handleMouseUpDrag(): void {
        document.removeEventListener('mousemove', handleMouseMoveDrag);
        document.removeEventListener('mouseup', handleMouseUpDrag);
      }

      setDraggedBlock(
        hoverBlock
          ? editor.children.find(({ id }) => id === hoverBlock.id) || null
          : null,
      );

      document.addEventListener('mousemove', handleMouseMoveDrag);
      document.addEventListener('mouseup', handleMouseUpDrag);
    },
    [mouse],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleScrollListener = useCallback(() => {
    const blocks = editor.children.map((child) =>
      ReactEditor.toDOMNode(editor, child),
    );
    const dimensions = [];
    let i;
    for (i = 0; i < blocks.length; i++) {
      dimensions.push({
        id: blocks[i].getAttribute('data-block-id'),
        rect: blocks[i].getBoundingClientRect(),
      });
    }

    setBlockPositions(dimensions);
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);

    return (): void => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  function handleKeyDown(): void {
    setHoverBlock(null);
  }

  function handleMouseLeave(): void {
    setHoverBlock(null);
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return (): void => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScrollListener);

    return (): void =>
      window.removeEventListener('scroll', handleScrollListener);
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('scroll', handleScrollListener);
    }
  }, [ref.current]);

  function handleMouseUpSelect(): void {
    setSelectingBlocks(false);
    setSelectAnchor(null);
    document.removeEventListener('mouseup', handleMouseUpSelect);
  }

  function handleMouseDownSelect(): void {
    setSelectedBlocks([]);
    setBlockSelection(null);

    if (hoverBlock) {
      setSelectAnchor(hoverBlock);
      document.addEventListener('mouseup', handleMouseUpSelect);
    }
  }

  useEffect(() => {
    if (selectingBlocks && hoverBlock) {
      const focusBlockIndex = editor.children.findIndex(
        ({ id }) => id === hoverBlock.id,
      );
      const anchorBlockIndex = editor.children.findIndex(
        ({ id }) => selectAnchor && id === selectAnchor.id,
      );
      if (anchorBlockIndex !== -1 && focusBlockIndex !== -1) {
        const anchorPath = ReactEditor.findPath(
          editor,
          editor.children[anchorBlockIndex],
        );
        const focusPath = ReactEditor.findPath(
          editor,
          editor.children[focusBlockIndex],
        );
        setBlockSelection({
          anchor: { path: anchorPath, offset: 0 },
          focus: { path: focusPath, offset: 0 },
        });
        if (anchorBlockIndex <= focusBlockIndex) {
          setSelectedBlocks(
            editor.children.filter(
              (block, index) =>
                index >= anchorBlockIndex && index <= focusBlockIndex,
            ),
          );
        } else {
          setSelectedBlocks(
            editor.children.filter(
              (block, index) =>
                index <= anchorBlockIndex && index >= focusBlockIndex,
            ),
          );
        }
      }
      setSelectFocus(hoverBlock);
    }
  }, [selectingBlocks, hoverBlock, editor.children]);

  useEffect(() => {
    const handleMouseUp = (): void => {
      if (
        isDragging &&
        draggedBlock &&
        hoverBlock &&
        draggedBlock.id &&
        draggedBlock.id !== hoverBlock.id
      ) {
        const movedBlock = editor.children.find(
          ({ id }) => id === draggedBlock.id,
        );
        const targetBlock = editor.children.find(
          ({ id }) => id === hoverBlock.id,
        );

        if (movedBlock && targetBlock) {
          const fromPath = ReactEditor.findPath(editor, movedBlock);
          const toPath = ReactEditor.findPath(editor, targetBlock);
          const movingUp = Point.isBefore(
            { path: toPath, offset: 0 },
            { path: fromPath, offset: 0 },
          );

          if (toPath && fromPath) {
            if (movingUp) {
              incrementPath(toPath);
            }

            if (blockSelection) {
              Transforms.moveNodes(editor, {
                to: toPath,
                at: blockSelection,
                mode: 'all',
              });
            } else {
              Transforms.moveNodes(editor, { to: toPath, at: fromPath });
            }
          }
        }
      }
    };

    document.addEventListener('mouseup', handleMouseUp);

    return (): void => document.removeEventListener('mouseup', handleMouseUp);
  }, [
    isDragging,
    selectAnchor,
    selectFocus,
    draggedBlock,
    hoverBlock,
    editor.children,
  ]);

  const handleClickInsertBlock = useCallback(() => {
    const triggerBlock = editor.children.find(
      ({ id }) => hoverBlock && id === hoverBlock.id,
    );

    if (triggerBlock) {
      const path = ReactEditor.findPath(editor, triggerBlock);
      incrementPath(path);
      Transforms.insertNodes(
        editor,
        { type: 'text', children: [{ text: '' }] },
        { at: path },
      );
      editor.selection = {
        anchor: { path, offset: 0 },
        focus: { path, offset: 0 },
      };
    }
  }, [hoverBlock, editor.children]);

  return (
    <Provider
      value={{
        ref,
        isDragging,
        draggedBlock,
        handleMouseDown,
        mouse,
        offset,
        blockPositions,
        hoverBlock,
        value: editor.children,
        selectedBlocks,
        selectAnchor,
        selectFocus,
        handleClickInsertBlock,
      }}
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDownSelect}
        style={{
          position: 'relative',
          padding: '0 40px',
          cursor: isDragging ? 'grabbing' : 'inherit',
        }}
      >
        {children}
      </div>
    </Provider>
  );
};

export default BlockPluginProvider;
export const useBlockPlugin = hook;
