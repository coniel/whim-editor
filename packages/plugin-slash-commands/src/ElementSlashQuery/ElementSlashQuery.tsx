import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  RenderElementProps,
  useUI,
  useSearch,
  isBlockAboveEmpty,
  SlashEditor,
  getBlockAbove,
} from '@sheets-editor/core';
import { Node, Transforms } from 'slate';
import { ReactEditor, useEditor, useSelected } from 'slate-react';
import isHotkey from 'is-hotkey';
import { MenuItem } from '../SlashCommandsPlugin.types';

export interface ElementSlashQueryProps extends RenderElementProps {
  menuItems: MenuItem[];
}

export const ElementSlashQuery: React.FC<ElementSlashQueryProps> = ({
  attributes,
  children,
  element,
  menuItems,
}) => {
  const { search, result } = useSearch<MenuItem>(menuItems);
  const editor = useEditor() as SlashEditor;
  const selected = useSelected();
  const [activeIndex, setActiveIndexState] = useState(0);
  const activeItemRef = useRef(menuItems[0]);
  const elementRef = useRef(element);
  const activeIndexRef = useRef(0);
  const [open, setOpen] = useState(true);
  const [refReady, setRefReady] = useState(false);
  const { Popover, List, MenuItem } = useUI();
  const ref = useRef<HTMLSpanElement>(null);
  const text = Node.string(element);
  const textRef = useRef('/');
  // Text starts with / and end with 0 width space
  const query = text.slice(1, -1);

  const setActiveIndex = (value: number) => {
    setActiveIndexState(value);
    activeIndexRef.current = value;
  };

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isHotkey('Enter', event)) {
      event.preventDefault();
      const blockAbove = getBlockAbove(editor);
      if (activeItemRef.current.inline) {
        Transforms.select(
          editor,
          ReactEditor.findPath(editor, elementRef.current),
        );
        editor.insertElement(activeItemRef.current.id);
      } else if (Node.string(blockAbove[0]) === textRef.current) {
        Transforms.select(editor, blockAbove[1]);
        Transforms.delete(editor);
        setTimeout(() => {
          editor.turnIntoElement(activeItemRef.current.id, {
            ...elementRef.current,
            children: [{ text: '' }],
          });
        });
      } else {
        editor.insertElement(activeItemRef.current.id);
      }
      close();
    } else if (isHotkey('Escape', event)) {
      close();
    } else if (isHotkey('ArrowDown', event)) {
      event.preventDefault();
      setActiveIndex(activeIndexRef.current + 1);
    } else if (isHotkey('ArrowUp', event)) {
      event.preventDefault();
      setActiveIndex(activeIndexRef.current - 1);
    }
  }, []);

  useEffect(() => {
    let activeItem: MenuItem;
    if (activeIndex < 0) {
      setActiveIndex(result.length - 1);
      activeItem = result[result.length - 1];
    } else if (activeIndex > result.length - 1) {
      setActiveIndex(0);
      activeItem = result[0];
    } else {
      activeItem = result[activeIndex];
    }

    activeItemRef.current = activeItem;
  }, [activeIndex, result]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    elementRef.current = element;
  }, [element]);

  useEffect(() => {
    if (!selected || query.length > 9 || text.length < 2) {
      close();
    } else {
      textRef.current = text;
      search(query);
    }
  }, [query, text]);

  useEffect(() => {
    if (ref.current) {
      setRefReady(true);
    }
  }, [ref.current]);

  useEffect(() => {
    if (!open) {
      // TODO: remove 0 width space
      const path = ReactEditor.findPath(editor, element);
      Transforms.unwrapNodes(editor, { at: path });
    }
  }, [open]);

  return (
    <>
      <span {...attributes}>
        <span contentEditable={false} ref={ref} />
        <span>{children}</span>
      </span>
      {createPortal(
        <Popover
          open={refReady && open}
          onClose={close}
          anchorEl={ref.current}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        >
          <List>
            {result.map((item, index) => (
              <MenuItem
                key={item.id}
                style={
                  index === activeIndex
                    ? {
                        backgroundColor: '#EFEFEF',
                      }
                    : {}
                }
              >
                {item.title}
              </MenuItem>
            ))}
          </List>
        </Popover>,
        document.body,
      )}
    </>
  );
};
