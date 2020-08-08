/** @jsx jsx */

import { jsx } from '../../test-utils';
import { SlashEditor } from '../../withPlugins';

export const run = (editor: SlashEditor): void => {
  editor.insertText('*');
};

export const input = (
  <editor>
    <block>
      some text
      <text>
        **more text*
        <cursor />
      </text>
    </block>
  </editor>
);

const props = { b: true };

export const output = (
  <editor>
    <block>
      <text>some text</text>
      <text {...props}>
        more text
        <cursor />
      </text>
    </block>
  </editor>
);
