/* eslint-disable no-console */
import React, { useState } from 'react';
import { Element } from '@braindrop-editor/core';
import { Editor } from './Editor';

export default {
  title: 'Editor/Full',
  component: Editor,
};

export const Default: React.FC = () => {
  const [value, setValue] = useState<Element[]>([
    {
      type: 'paragraph',
      id: '4',
      properties: {},
      children: [
        {
          text:
            'Vivamus euismod mauris. Maecenas vestibulum mollis diam. Praesent metus tellus, elementum eu, semper a, adipiscing nec, purus. Suspendisse non nisl sit amet velit hendrerit rutrum. Curabitur blandit mollis lacus.',
        },
      ],
    },
  ]);

  console.log(value);

  return (
    <div
      style={{
        minWidth: '100vh',
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Editor
        onChange={(newValue): void => setValue(newValue as Element[])}
        value={value}
      />
    </div>
  );
};
