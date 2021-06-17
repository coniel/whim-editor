import React, { useState } from 'react';
import { Descendant } from 'slate';
import { Editor } from './Editor';

export default {
  title: 'Editor/Full',
  component: Editor,
};

console.log('EDITOR STORY');

export const Default: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      id: '4',
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
      <Editor onChange={(newValue): void => setValue(newValue)} value={value} />
    </div>
  );
};
