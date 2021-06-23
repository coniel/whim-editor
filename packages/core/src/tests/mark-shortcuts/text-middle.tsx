/** @jsx jsx */

import { jsx } from '../../test-utils';
import { BraindropEditor } from '../../types';

export const run = (editor: BraindropEditor): void => {
  editor.insertText('*');
};

export const input = (
  <editor>
    <block>
      <text>
        **some text*
        <cursor />
        more text
      </text>
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
        more text
      </text>
    </block>
  </editor>
);
