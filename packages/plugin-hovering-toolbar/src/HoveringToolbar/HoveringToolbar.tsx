import React, { useEffect, useState, useCallback } from 'react';
import { useSlate, ReactEditor } from 'slate-react';
import { Range, Editor } from 'slate';
import { useEditorState, useUI } from '@braindrop-editor/core';

export type HoveringToolbarProps = React.HTMLProps<HTMLDivElement>;

export const HoveringToolbar: React.FC<HoveringToolbarProps> = ({
  children,
}) => {
  const { Popover } = useUI();
  const { toggle, turnOff, turnOn } = useEditorState();
  const [anchorPosition, setAnchorPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [mouseDown, setMouseDown] = useState(false);
  const editor = useSlate();
  const open = toggle('hovering-toolbar');

  const close = useCallback(() => {
    turnOff('hovering-toolbar');
  }, []);

  useEffect(() => {
    function handleMouseDown(): void {
      setMouseDown(true);
    }

    function handleMouseUp(): void {
      setMouseDown(false);
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return (): void => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const { selection } = editor;

    if (open && (!selection || Range.isCollapsed(selection))) {
      close();
    }

    if (open || !selection || mouseDown) {
      return;
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      close();
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection) {
      return;
    }
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();

    setAnchorPosition({
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    });
    turnOn('hovering-toolbar');
  }, [editor.selection, mouseDown]);

  return (
    <Popover
      disableBackdrop
      open={open}
      anchorReference="anchorPosition"
      onClose={close}
      anchorPosition={anchorPosition}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      {children}
    </Popover>
  );
};
