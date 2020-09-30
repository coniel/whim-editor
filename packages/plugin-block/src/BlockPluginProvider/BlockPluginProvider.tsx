import React, { useState, useEffect, useCallback } from 'react';
import {
  Node,
  Range,
  Path,
  Point,
  Transforms,
  Element as SlateElement,
} from 'slate';
import isHotkey from 'is-hotkey';
import { Element, createContext } from '@sheets-editor/core';
import { ReactEditor, useSlate } from 'slate-react';

export interface Coordinates {
  x: number;
  y: number;
}

export interface Block extends Element {
  rect: DOMRect;
  path: Path;
}

export interface BlockPluginContextValue {
  ref: React.RefObject<HTMLDivElement>;
  isDragging: boolean;
  draggedBlock: Block | null;
  handleMouseDown: (event: React.MouseEvent) => void;
  handleClickInsertBlock: (event: React.MouseEvent) => void;
  blockSelection: Range | null;
  offset: Coordinates;
  mouse: Coordinates;
  hoverBlock: Block | null;
  value: Node[];
  selectedBlocks: Node[];
  selectAnchor: Block | null;
  selectFocus: Block | null;
  blocks: Block[];
  contextMenu: Coordinates | null;
  closeContextMenu: () => void;
}

function incrementPath(path: Path, amount = 1): void {
  const pathLast = path.length - 1;
  path[pathLast] += amount;
}

export function getFirstPathBlock(
  root: Node,
  blocks: Block[],
  path: Path,
): Block | null {
  const levels = Array.from(Node.levels(root, path));
  let anchorNode = levels.pop();
  while (anchorNode && !SlateElement.isElement(anchorNode[0])) {
    anchorNode = levels.pop();
  }

  let block;

  if (anchorNode) {
    const element = anchorNode ? anchorNode[0] : null;
    if (element) {
      block = blocks.find(({ id }) => id === element.id);
    }
  }

  return block || null;
}

function getBlockPath(root: ReactEditor, path: Path): Path | null {
  const levels = Array.from(Node.levels(root, path));
  let anchorNode = levels.pop();
  while (anchorNode && !SlateElement.isElement(anchorNode[0])) {
    anchorNode = levels.pop();
  }

  if (anchorNode) {
    return ReactEditor.findPath(root, anchorNode[0]) || null;
  }

  return null;
}

function getNextBlock(blocks: Block[], block: Block): Block | null {
  try {
    const nextPath = Path.next(block.path);
    const nextBlock = blocks.find(({ path }) => Path.equals(nextPath, path));

    return nextBlock || null;
  } catch (err) {
    return null;
  }
}

function getPreviousBlock(blocks: Block[], block: Block): Block | null {
  try {
    const nextPath = Path.previous(block.path);
    const nextBlock = blocks.find(({ path }) => Path.equals(nextPath, path));

    return nextBlock || null;
  } catch (err) {
    return null;
  }
}

function childrenToBlocks(editor: ReactEditor): Block[] {
  return editor.children.map((child, index) => ({
    ...(child as Element),
    index,
    path: ReactEditor.findPath(editor, child),
    rect: ReactEditor.toDOMNode(editor, child).getBoundingClientRect(),
  }));
}

function getBlockRange(block: Block): Range {
  const lastText = Array.from(Node.texts(block)).slice(-1)[0];
  return {
    anchor: { path: [...block.path, 0], offset: 0 },
    focus: {
      path: [...block.path, ...lastText[1]],
      offset: lastText[0].text.length,
    },
  };
}

function sortBlocksByPath(blocks: Block[]): Block[] {
  return blocks.sort((a, b) => (Path.isBefore(a.path, b.path) ? 1 : 0));
}

function blocksToRange(blocks: Block[]): Range {
  if (!blocks.length) {
    return {
      anchor: { path: [0], offset: 0 },
      focus: { path: [0], offset: 0 },
    };
  }
  const sortedBlocks = sortBlocksByPath(blocks);

  const firstBlock = sortedBlocks[0];
  const lastBlock = sortedBlocks[sortedBlocks.length - 1];

  return {
    anchor: { path: firstBlock.path, offset: 0 },
    focus: { path: lastBlock.path, offset: 0 },
  };
}

const [hook, Provider] = createContext<BlockPluginContextValue>();

const BlockPluginProvider: React.FC = ({ children }) => {
  const editor = useSlate();

  const ref = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);
  const [hoverBlock, setHoverBlock] = useState<Block | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<Coordinates | null>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [selectingBlocks, setSelectingBlocks] = useState(false);
  const [selectAnchor, setSelectAnchor] = useState<Block | null>(null);
  const [selectFocus, setSelectFocus] = useState<Block | null>(null);
  const [blockSelection, setBlockSelection] = useState<Range | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<Block[]>([]);
  const textInpputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectingBlocks) {
      // Fix for Safari not deselecting editor
      // when selecting text over multiple blocks
      textInpputRef.current?.focus();
    }
  }, [selectingBlocks]);

  useEffect(() => {
    const copySelectedBlocks = (event: ClipboardEvent): void => {
      if (event && event.clipboardData) {
        event.clipboardData.setData(
          'text/sheets',
          JSON.stringify(selectedBlocks),
        );
        event.clipboardData.setData(
          'text/plain',
          JSON.stringify(selectedBlocks),
        );
        event.clipboardData.setData(
          'text/html',
          JSON.stringify(selectedBlocks),
        );
        event.preventDefault();
      }
    };
    document.addEventListener('copy', copySelectedBlocks);

    return (): void => document.removeEventListener('copy', copySelectedBlocks);
  }, [selectedBlocks]);

  const mouseDownStateHandler = useCallback((event: MouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    setMouseDown(true);
  }, []);

  const mouseUpStateHandler = useCallback((event: MouseEvent) => {
    if (event.button !== 0) {
      return;
    }
    setMouseDown(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousedown', mouseDownStateHandler);
    window.addEventListener('mouseup', mouseUpStateHandler);

    return (): void => {
      window.removeEventListener('mousedown', mouseDownStateHandler);
      window.removeEventListener('mouseup', mouseUpStateHandler);
    };
  }, []);

  useEffect(() => {
    const keyDownSelect = (event: KeyboardEvent): void => {
      if (selectFocus && selectAnchor && !editor.selection) {
        let anchor = selectAnchor;
        const focus = selectFocus;

        if (!selectedBlocks.length) {
          anchor = focus;
        }

        if (isHotkey('Shift+ArrowDown', event)) {
          if (Path.isAfter(anchor.path, focus.path)) {
            const previous = getNextBlock(blocks, focus);
            if (previous) {
              setSelectedBlocks((value) =>
                value.filter(({ id }) => id !== focus.id),
              );
              setSelectFocus(previous);
            }
          } else {
            const next = getNextBlock(blocks, focus);
            if (next) {
              setSelectedBlocks((value) => [...value, next]);
              setSelectFocus(next);
            }
          }
        } else if (isHotkey('Shift+ArrowUp', event)) {
          if (Path.isBefore(anchor.path, focus.path)) {
            const previous = getPreviousBlock(blocks, focus);
            if (previous) {
              setSelectedBlocks((value) =>
                value.filter(({ id }) => id !== focus.id),
              );
              setSelectFocus(previous);
            }
          } else {
            const next = getPreviousBlock(blocks, focus);
            if (next) {
              setSelectedBlocks((value) => [...value, next]);
              setSelectFocus(next);
            }
          }
        } else if (isHotkey('ArrowDown', event)) {
          let next: Block | null;
          if (Path.isBefore(focus.path, anchor.path)) {
            next = getNextBlock(blocks, anchor);
          } else {
            next = getNextBlock(blocks, focus);
          }

          if (next) {
            event.preventDefault();
            setSelectedBlocks([next]);
            setSelectFocus(next);
            setSelectAnchor(next);
          }
        } else if (isHotkey('ArrowUp', event)) {
          let previous: Block | null;
          if (Path.isAfter(focus.path, anchor.path)) {
            previous = getPreviousBlock(blocks, anchor);
          } else {
            previous = getPreviousBlock(blocks, focus);
          }
          if (previous) {
            event.preventDefault();
            setSelectedBlocks([previous]);
            setSelectFocus(previous);
            setSelectAnchor(previous);
          }
        }
      }

      if (selectedBlocks.length && isHotkey('Escape', event)) {
        setSelectedBlocks([]);
        setSelectAnchor(selectFocus);
      }

      if (
        selectedBlocks.length &&
        (isHotkey('Delete', event) || isHotkey('Backspace', event))
      ) {
        setSelectedBlocks([]);
        if (selectAnchor && selectFocus) {
          const anchorRange = getBlockRange(selectAnchor);
          const focusRange = getBlockRange(selectFocus);
          Transforms.removeNodes(editor, {
            at: {
              anchor: anchorRange.anchor,
              focus: focusRange.focus,
            },
          });
        }
      }

      if (
        !selectedBlocks.length &&
        editor.selection &&
        isHotkey('mod+A', event)
      ) {
        event.preventDefault();
        const block = getFirstPathBlock(
          editor,
          blocks,
          editor.selection.anchor.path,
        );
        if (block) {
          const blockRange = getBlockRange(block);
          if (
            Range.equals(blockRange, editor.selection) ||
            Range.equals(
              { anchor: blockRange.focus, focus: blockRange.anchor },
              editor.selection,
            )
          ) {
            setSelectAnchor(block);
            setSelectFocus(block);
            setSelectedBlocks([block]);
            ReactEditor.deselect(editor);
          } else {
            Transforms.select(editor, blockRange);
          }
        }
      } else if (selectedBlocks.length && isHotkey('mod+A', event)) {
        setSelectedBlocks(blocks);
      }

      if (selectedBlocks.length && isHotkey('Enter', event)) {
        event.preventDefault();
        const block = selectedBlocks[0];
        setSelectedBlocks([]);
        Transforms.select(editor, block.path);
        Transforms.collapse(editor, { edge: 'end' });
      }

      if (isHotkey('mod+D', event)) {
        event.preventDefault();
        if (selectedBlocks.length) {
          const at = blocksToRange(selectedBlocks).anchor.path;
          // incrementPath(at);
          Transforms.insertNodes(editor, sortBlocksByPath(selectedBlocks), {
            at,
            mode: 'highest',
          });
        } else if (editor.selection) {
          const path = getBlockPath(editor, editor.selection.anchor.path);

          if (path) {
            const block = getFirstPathBlock(editor, blocks, path);

            if (block) {
              // const path = ReactEditor.findPath(editor, block);

              // incrementPath(path);
              setSelectedBlocks([block]);
              Transforms.insertNodes(
                editor,
                JSON.parse(JSON.stringify(block)),
                {
                  at: path,
                },
              );
              ReactEditor.deselect(editor);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', keyDownSelect);

    return (): void => {
      window.removeEventListener('keydown', keyDownSelect);
    };
  }, [selectedBlocks, blocks, selectFocus, selectAnchor]);

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
    const { onChange } = editor;

    editor.onChange = (): void => {
      const selection = editor.selection ? { ...editor.selection } : null;
      if (
        !selectingBlocks &&
        selection &&
        !Path.equals(selection.anchor.path, selection.focus.path)
      ) {
        ReactEditor.deselect(editor);
        setSelectedBlocks(
          blocks.filter((block) => Range.includes(selection, block.path)),
        );

        if (selection) {
          setSelectAnchor(
            getFirstPathBlock(editor, blocks, selection.anchor.path),
          );
          setSelectFocus(
            getFirstPathBlock(editor, blocks, selection.focus.path),
          );
        }
      }
      onChange();
    };
  }, [blocks, selectingBlocks]);

  useEffect(() => {
    const newBlocks = childrenToBlocks(editor);
    setBlocks(newBlocks);
    if (selectedBlocks.length) {
      const newSelectedBlocks = selectedBlocks
        .map((block) => newBlocks.find(({ id }) => id === block.id))
        .filter((block) => typeof block !== 'undefined') as Block[];

      setSelectedBlocks(newSelectedBlocks);
      setBlockSelection(blocksToRange(newSelectedBlocks));
      setSelectAnchor(newSelectedBlocks[0]);
      setSelectFocus(newSelectedBlocks[newSelectedBlocks.length - 1]);
    }
  }, [editor.children]);

  useEffect(() => {
    const matches = blocks.filter(
      ({ rect }) => mouse.y && rect.top <= mouse.y && rect.bottom >= mouse.y,
    );
    const hBlock = matches[0] ? matches[0] : null;
    setHoverBlock(hBlock);

    if (selectAnchor && hBlock && mouseDown) {
      if (!selectingBlocks && selectAnchor.id !== hBlock.id) {
        setSelectingBlocks(true);
        ReactEditor.deselect(editor);
      }
    } else if (!mouseDown) {
      setSelectingBlocks(false);
    }
  }, [mouse, selectAnchor, selectingBlocks, mouseDown]);

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

      setDraggedBlock(hoverBlock);

      document.addEventListener('mousemove', handleMouseMoveDrag);
      document.addEventListener('mouseup', handleMouseUpDrag);
    },
    [mouse],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleScrollListener = useCallback(() => {
    setBlocks(childrenToBlocks(editor));
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

  function handleMouseUpSelect(event: MouseEvent): void {
    // Only handle left mouse button
    if (event.button !== 0) {
      return;
    }
    setSelectingBlocks(false);
    document.removeEventListener('mouseup', handleMouseUpSelect);
  }

  function closeContextMenu(): void {
    setContextMenu(null);
    setSelectedBlocks([]);
  }

  function handleContextMenu(event: React.MouseEvent) {
    event.preventDefault();

    if (!selectedBlocks.length) {
      const matches = blocks.filter(
        ({ rect }) =>
          event.clientY &&
          rect.top <= event.clientY &&
          rect.bottom >= event.clientY,
      );

      setSelectedBlocks(matches);
    }

    if (blocks.length) {
      // setSelectedBlocks(blocks);
      Transforms.setSelection(editor, {});
      textInpputRef.current?.focus();
      setContextMenu(mouse);
    }
  }

  function handleMouseDownSelect(event: React.MouseEvent): void {
    // Only handle left click
    if (event.button !== 0 || contextMenu) {
      return;
    }

    setSelectedBlocks([]);
    setBlockSelection(null);

    if (event.shiftKey && hoverBlock && (editor.selection || selectAnchor)) {
      setSelectFocus(hoverBlock);
      let anchor = selectAnchor;

      if (editor.selection) {
        anchor = getFirstPathBlock(
          editor,
          blocks,
          editor.selection.anchor.path,
        );
      }

      if (anchor && hoverBlock) {
        event.preventDefault();
        event.stopPropagation();

        ReactEditor.deselect(editor);
        setBlockSelection({
          anchor: { path: anchor.path, offset: 0 },
          focus: { path: hoverBlock.path, offset: 0 },
        });
        setSelectedBlocks(
          blocks.filter((block) =>
            Range.includes(
              {
                anchor: { path: (anchor as Block).path, offset: 0 },
                focus: { path: hoverBlock.path, offset: 0 },
              },
              block.path,
            ),
          ),
        );
      }
    } else if (hoverBlock) {
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
            blocks.filter(
              (block, index) =>
                index >= anchorBlockIndex && index <= focusBlockIndex,
            ),
          );
        } else {
          setSelectedBlocks(
            blocks.filter(
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
        draggedBlock !== hoverBlock
      ) {
        const fromPath = draggedBlock.path;
        const toPath = hoverBlock.path;
        const movingUp = Point.isBefore(
          { path: toPath, offset: 0 },
          { path: fromPath, offset: 0 },
        );

        if (movingUp) {
          incrementPath(toPath);
        }

        if (blockSelection) {
          if (!Range.includes(blockSelection, hoverBlock.path)) {
            Transforms.moveNodes(editor, {
              to: toPath,
              at: blockSelection,
              mode: 'all',
            });
          }
        } else {
          Transforms.moveNodes(editor, { to: toPath, at: fromPath });
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
      let path = ReactEditor.findPath(editor, triggerBlock);
      path = Path.next(path);
      Transforms.insertNodes(
        editor,
        { type: 'paragraph', children: [{ text: '' }] },
        { at: path, select: true },
      );
      setTimeout(() => {
        ReactEditor.focus(editor);
        setSelectedBlocks([]);
        setBlockSelection(null);
      });
    }
  }, [hoverBlock, editor.children]);

  return (
    <Provider
      value={{
        ref,
        isDragging,
        draggedBlock,
        handleMouseDown,
        contextMenu,
        closeContextMenu,
        mouse,
        offset,
        blocks,
        hoverBlock,
        value: editor.children,
        selectedBlocks,
        selectAnchor,
        selectFocus,
        blockSelection,
        handleClickInsertBlock,
      }}
    >
      <input
        type="text"
        ref={textInpputRef}
        style={{
          width: 0,
          height: 0,
          outline: 'none',
          position: 'absolute',
          left: -1000,
        }}
        defaultValue=" "
      />
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDownSelect}
        onContextMenu={handleContextMenu}
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
