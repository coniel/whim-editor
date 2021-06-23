/** @jsx jsx */

import { jsx } from '../../test-utils';
import { BraindropEditor } from '../../types';

export const run = (editor: BraindropEditor): void => {
  editor.insertText(' ');
};

export const input = (
  <editor>
    <block type="text">
      <text>
        -<cursor />
      </text>
    </block>
  </editor>
);

// Should turn into unordered list
export const output = (
  <editor>
    <block type="unordered-list">
      <cursor />
    </block>
  </editor>
);
