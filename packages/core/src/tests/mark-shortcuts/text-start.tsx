/** @jsx jsx */

import { jsx } from '../../test-utils';
import { SlashEditor } from '../../withPlugins';

export const run = (editor: SlashEditor): void => {
  editor.insertText('*');
};

export const input = (
  <editor>
    <block>
      <text>**some text*</text>
      <cursor />
    </block>
  </editor>
);

const props = { b: true };

export const output = (
  <editor>
    <block>
      <text {...props}>some text</text>
      <text>
        <cursor />
      </text>
    </block>
  </editor>
);
