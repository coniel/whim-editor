import React, { useRef, useEffect, useState } from 'react';
import { useSlate, ReactEditor } from 'slate-react';
import { Range, Editor } from 'slate';
import { HoveringToolbarPortal } from '../HoveringToolbarPortal';

export type HoveringToolbarProps = React.HTMLProps<HTMLDivElement>;

const baseStyle: React.HTMLAttributes<HTMLDivElement>['style'] = {
  position: 'absolute',
  zIndex: 1,
  top: -1000,
  left: -1000,
  opacity: 0,
};

export const HoveringToolbar: React.FC<HoveringToolbarProps> = ({
  children,
}) => {
  const [style, setStyle] = useState(baseStyle);
  const [mouseDown, setMouseDown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();

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
    const el = ref.current;
    const { selection } = editor;

    if (!el || mouseDown) {
      return;
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      setStyle(baseStyle);
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection) {
      return;
    }
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    setStyle({
      ...baseStyle,
      opacity: 1,
      top: rect.top + window.pageYOffset - el.offsetHeight,
      left:
        rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2,
    });
  }, [editor.selection, mouseDown]);

  return (
    <HoveringToolbarPortal>
      <div ref={ref} style={style}>
        {children}
      </div>
    </HoveringToolbarPortal>
  );
};
