import React from 'react';
import { RenderElementProps, useUI } from '@braindrop-editor/core';
import { OrderedListElement } from '../OrderedListPlugin.types';

export interface ElementOrderedListProps extends RenderElementProps {
  element: OrderedListElement;
}

export const ElementOrderedList: React.FC<ElementOrderedListProps> = ({
  attributes,
  children,
  element,
}) => {
  const { PlaceholderText } = useUI();

  return (
    <div
      {...attributes}
      style={{
        position: 'relative',
        display: 'flex',
        paddingLeft: 2,
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
          marginTop: '0.07em',
          minHeight: 'calc(1em + 3px + 3px)',
          flexGrow: 0,
          flexShrink: 0,
          paddingRight: 2,
        }}
      >
        {element.number}.
      </div>
      <div
        style={{
          flex: '1 1 0px',
          minWidth: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '3px 0' }}>
          <PlaceholderText text="List" element={element} />
          {children}
        </div>
      </div>
    </div>
  );
};
