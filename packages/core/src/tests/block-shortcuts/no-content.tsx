/** @jsx jsx */

import { jsx } from '../../test-utils';
import { BraindropEditor } from '../../types';

export const run = (editor: BraindropEditor): void => {
  editor.insertText(']');
};

export const input = (
  <editor>
    <block type="text">
      <text>
        [<cursor />
      </text>
    </block>
  </editor>
);

// Should not apply mark
export const output = (
  <editor>
    <block type="to-do">
      <cursor />
    </block>
  </editor>
);
