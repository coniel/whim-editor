/** @jsx jsx */

import { jsx } from '../../test-utils';
import { BraindropEditor } from '../../types';

export const run = (editor: BraindropEditor): void => {
  editor.insertText('*');
};

export const input = (
  <editor>
    <block>
      <text>***</text>
      <cursor />
    </block>
  </editor>
);

// Should not apply mark
export const output = (
  <editor>
    <block>
      <text>****</text>
      <cursor />
    </block>
  </editor>
);
