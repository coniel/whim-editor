/** @jsx jsx */

import { jsx } from '@slash/test-utils';
import { SlashEditor } from '../../withPlugins';

export const run = (editor: SlashEditor): void => {
  editor.insertText(']');
};

export const input = (
  <editor>
    <block type="to-do">
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
      []
      <cursor />
    </block>
  </editor>
);
