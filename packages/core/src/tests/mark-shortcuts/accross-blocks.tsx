/** @jsx jsx */

import { jsx } from '../../test-utils';
import { BraindropEditor } from '../../types';

export const run = (editor: BraindropEditor): void => {
  editor.insertText('*');
};

export const input = (
  <editor>
    <block>
      <text>**some text</text>
    </block>
    <block>
      <text>some more text*</text>
      <cursor />
    </block>
  </editor>
);

export const output = (
  <editor>
    <block>
      <text>**some text</text>
    </block>
    <block>
      <text>some more text**</text>
      <cursor />
    </block>
  </editor>
);
