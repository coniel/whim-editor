/** @jsx jsx */

import { jsx } from '../../test-utils';
import { SlashEditor } from '../../withPlugins';

export const run = (editor: SlashEditor): void => {
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
