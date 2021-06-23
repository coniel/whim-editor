import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import {
  RenderElementProps,
  useUI,
  useSearch,
  BraindropEditor,
  getBlockAbove,
} from '@braindrop-editor/core';
import { Node, Transforms } from 'slate';
import { ReactEditor, useSlateStatic, useSelected } from 'slate-react';
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
  const editor = useSlateStatic() as BraindropEditor;
  const selected = useSelected();
  const [activeIndex, setActiveIndexState] = useState(0);
  const activeItemRef = useRef(menuItems[0]);
  const elementRef = useRef(element);
  const activeIndexRef = useRef(0);
  const [ignoreMouse, setIgnoreMouse] = useState(true);
  const [open, setOpen] = useState(true);
  const [refReady, setRefReady] = useState(false);
  const { Popover, List, MenuItem, MenuSectionHeading, MenuDivider } = useUI();
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

  const handleSubmit = useCallback(() => {
    try {
      const blockAbove = getBlockAbove(editor);
      if (activeItemRef.current.inline) {
        Transforms.select(
          editor,
          ReactEditor.findPath(editor, elementRef.current),
        );
        Transforms.delete(editor);

        setTimeout(() => {
          editor.insertElement(activeItemRef.current.id);
        });
      } else if (Node.string(blockAbove[0]) === textRef.current) {
        Transforms.select(editor, blockAbove[1]);
        Transforms.delete(editor);
        editor.turnIntoElement(activeItemRef.current.id, {
          ...elementRef.current,
          children: [{ text: '' }],
        });
        setTimeout(() => {
          editor.turnIntoElement(activeItemRef.current.id, {
            ...elementRef.current,
            children: [{ text: '' }],
          });
          setTimeout(() => {
            ReactEditor.focus(editor);
            Transforms.select(editor, blockAbove[1]);
          });
        });
      } else {
        Transforms.select(
          editor,
          ReactEditor.findPath(editor, elementRef.current),
        );
        Transforms.delete(editor);
        setTimeout(() => {
          editor.insertElement(activeItemRef.current.id);
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    close();
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    setIgnoreMouse(true);
    if (isHotkey('Enter', event)) {
      event.preventDefault();
      handleSubmit();
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

  const handleMouseMove = useCallback(() => {
    setIgnoreMouse(false);
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

    if (activeItem) {
      const menuItem = document.getElementById(
        `slash-menu-item-${activeItem.id}`,
      );

      if (ignoreMouse && menuItem) {
        menuItem.scrollIntoView({ block: 'nearest' });
      }
    }

    activeItemRef.current = activeItem;
  }, [activeIndex, result, ignoreMouse]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
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
      const path = ReactEditor.findPath(editor, element);

      if (Node.has(editor, path)) {
        const node = Node.get(editor, path);
        const text = Node.string(node).replace('​', ''); // Replace 0 width space with empty string
        Transforms.removeNodes(editor, { at: path });
        Transforms.insertNodes(editor, [{ text }], { at: path, select: true });
      }
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
          <div
            style={{
              maxHeight: '40vh',
              overflow: 'hidden auto',
              maxWidth: 'calc(100vw - 32px)',
              width: 330,
            }}
          >
            <List>
              {result.map((item, index) => (
                <Fragment key={item.id}>
                  {(index === 0 || item.group !== result[index - 1].group) && (
                    <>
                      {index !== 0 && <MenuDivider />}
                      <MenuSectionHeading>{item.group}</MenuSectionHeading>
                    </>
                  )}
                  <div id={`slash-menu-item-${item.id}`}>
                    <MenuItem
                      onMouseEnter={(): void => setActiveIndex(index)}
                      onClick={(event): void => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleSubmit();
                      }}
                      style={
                        index === activeIndex
                          ? {
                              backgroundColor: '#DEEAFF',
                            }
                          : {}
                      }
                      primaryText={item.title}
                      secondaryText={item.subtitle}
                      image={item.image}
                      imageSize={item.imageSize || 'large'}
                      icon={item.icon}
                      tooltip={item.tooltip}
                      tooltipImage={item.tooltipImage}
                    />
                  </div>
                </Fragment>
              ))}
              {result.length === 0 && (
                <div
                  style={{
                    padding: '4px 16px',
                    color: '#878682',
                    fontSize: '14px',
                  }}
                >
                  No matches
                </div>
              )}
            </List>
            {ignoreMouse && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                }}
              />
            )}
          </div>
        </Popover>,
        document.body,
      )}
    </>
  );
};
