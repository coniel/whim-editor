import React, { useState } from 'react';
import { Node } from 'slate';
import { Editor } from './Editor';

export default {
  title: 'editor|Full',
  component: Editor,
};

export const Default: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [
        {
          id: '1',
          text:
            'Vestibulum volutpat pretium libero. Pellentesque auctor neque nec urna. Nulla porta dolor. Etiam ut purus mattis mauris sodales aliquam. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
        },
      ],
    },
    {
      type: 'paragraph',
      id: '2',
      children: [
        {
          text:
            'Ut a nisl id ante tempus hendrerit. Vestibulum rutrum, mi nec elementum vehicula, eros quam gravida nisl, id fringilla neque ante vel mi. Phasellus consectetuer vestibulum elit. Aenean imperdiet. Integer tincidunt.',
        },
      ],
    },
    {
      type: 'paragraph',
      id: '3',
      children: [
        {
          text:
            'Vestibulum volutpat pretium libero. Fusce commodo aliquam arcu. Praesent adipiscing. Nullam cursus lacinia erat. Ut id nisl quis enim dignissim sagittis.',
        },
      ],
    },
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
