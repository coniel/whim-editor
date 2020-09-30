import React from 'react';
import { RenderElementProps, useUI } from '@sheets-editor/core';

export type ElementUnorderedListProps = RenderElementProps;

const ElementUnorderedList: React.FC<ElementUnorderedListProps> = ({
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
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: 6,
            background: 'currentcolor',
            marginTop: '0.2em',
          }}
        />
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

export default ElementUnorderedList;
