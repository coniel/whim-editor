/** @jsx jsx */

import { jsx } from '@slash/test-utils';
import { SlashEditor } from '../../withPlugins';

export const run = (editor: SlashEditor): void => {
  editor.insertText(']');
};

export const input = (
  <editor>
    <block type="text">
      <text>
        [<cursor />
        some text
      </text>
    </block>
  </editor>
);

// Should not apply mark
export const output = (
  <editor>
    <block type="to-do">
      <cursor />
      some text
    </block>
  </editor>
);
