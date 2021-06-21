import React, { useCallback } from 'react';
import { RenderElementProps, useUI } from '@sheets-editor/core';
import { ToDoListElement } from '../ToDoListPlugin.types';

export interface ElementToDoListProps extends RenderElementProps {
  element: ToDoListElement;
  checkedColor?: string;
  uncheckedColor?: string;
  onClickCheckbox: (element: ToDoListElement) => void;
}

const ElementToDoList: React.FC<ElementToDoListProps> = ({
  attributes,
  children,
  element,
  onClickCheckbox,
  checkedColor = 'rgb(46, 170, 220)',
  uncheckedColor = 'rgb(55, 53, 47)',
}) => {
  const { PlaceholderText } = useUI();
  const { done } = element;

  const handleClick = useCallback(() => onClickCheckbox(element), [
    element,
    onClickCheckbox,
  ]);

  return (
    <div
      {...attributes}
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        alignItems: 'flex-start',
        padding: '3px 0 3px 2px',
        margin: '2px 0',
      }}
    >
      <div
        contentEditable={false}
        style={{
          userSelect: 'none',
          marginRight: 4,
          width: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(1em + 3px + 3px)',
          height: '100%',
          flexGrow: 0,
          flexShrink: 0,
          paddingRight: 2,
          paddingTop: 2,
        }}
      >
        <div
          style={{
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            flexShrink: 0,
            flexGrow: 0,
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'background 200ms ease-out 0s',
            background: done ? checkedColor : 'transparent',
          }}
        >
          <div
            role="button"
            tabIndex={-1}
            aria-disabled="false"
            onClick={handleClick}
            style={{
              userSelect: 'none',
              transition: 'background 20ms ease-in 0s',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {!done && (
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  fill: uncheckedColor,
                }}
              >
                <path d="M3 0H21C22.6569 0 24 1.34315 24 3V21C24 22.6569 22.6569 24 21 24H3C1.34315 24 0 22.6569 0 21V3C0 1.34315 1.34315 0 3 0ZM3 2C2.44772 2 2 2.44772 2 3V21C2 21.5523 2.44772 22 3 22H21C21.5523 22 22 21.5523 22 21V3C22 2.44772 21.5523 2 21 2H3Z" />
              </svg>
            )}
            {done && (
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: 12,
                  height: 12,
                  display: 'block',
                  fill: '#FFF',
                }}
              >
                <path d="M22.2076 2.88974C22.8745 3.38116 23.0168 4.32019 22.5254 4.98712L10.305 21.572C9.81354 22.2389 8.87451 22.3812 8.20758 21.8897C7.54065 21.3983 7.39837 20.4593 7.88979 19.7924L20.1102 3.20753C20.6016 2.5406 21.5406 2.39832 22.2076 2.88974Z" />
                <path d="M0.996542 13.8789C1.54692 13.2598 2.49503 13.204 3.1142 13.7544L9.87197 19.7613C10.4911 20.3116 10.5469 21.2598 9.99654 21.8789C9.44616 22.4981 8.49806 22.5539 7.87888 22.0035L1.12111 15.9966C0.501936 15.4462 0.446165 14.4981 0.996542 13.8789Z" />
              </svg>
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          flex: '1 1 0px',
          minWidth: 1,
          display: 'flex',
          flexDirection: 'column',
          opacity: done ? 0.5 : 1,
          textDecoration: done ? 'line-through rgba(0, 0, 0, 0.3)' : 'none',
        }}
      >
        <div style={{ padding: '3px 0' }}>
          <PlaceholderText text="To-do" element={element} />
          {children}
        </div>
      </div>
    </div>
  );
};

export default ElementToDoList;
