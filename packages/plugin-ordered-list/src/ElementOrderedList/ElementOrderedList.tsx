import React from 'react';
import { RenderElementProps, SlashEditor } from '@sheets-editor/core';

export interface ElementOrderedListProps extends RenderElementProps {
  editor: SlashEditor;
}

const ElementOrderedList: React.FC<ElementOrderedListProps> = ({
  attributes,
  children,
  element,
}) => {
  return (
    <div
      {...attributes}
      style={{
        display: 'flex',
        paddingLeft: 2,
        width: '100%',
        alignItems: 'flex-start',
        padding: '3px 0 3px 2px',
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
        <div style={{ padding: '3px 0' }}>{children}</div>
      </div>
    </div>
  );
};

export default ElementOrderedList;
