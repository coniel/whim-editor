import React, { useState } from 'react';
import { Node } from 'slate';
import { Editor } from '@slash/editor';
import { LoremIpsum } from 'lorem-ipsum';
import { v4 } from 'uuid';
import * as components from '@slash/material-ui';
import BlockPlugin from './BlockPlugin';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

function generateBlocks(count: number): Node[] {
  let remainingCount = count;
  const blocks: Node[] = [];

  while (remainingCount > 0) {
    blocks.push({
      type: 'text',
      id: v4(),
      children: [
        {
          text: `_${count - remainingCount}_ ${lorem.generateSentences(3)}`,
        },
      ],
    });
    remainingCount -= 1;
  }

  return blocks;
}

export default { title: 'Plugins|Block' };

const Block = BlockPlugin();

export const WithBlockPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>(generateBlocks(50));

  return (
    <Editor
      components={components}
      value={value}
      plugins={[Block]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
