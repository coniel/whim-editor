/** @jsx jsx */

import { jsx } from '../../test-utils';
import { SlashEditor } from '../../withPlugins';

export const run = (editor: SlashEditor): void => {
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
