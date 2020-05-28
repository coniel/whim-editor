/** @jsx jsx */

import { jsx } from '@slash/test-utils';
import { SlashEditor } from '../../withPlugins';

export const run = (editor: SlashEditor): void => {
  editor.insertText(']');
};

export const input = (
  <editor>
    <block>
      some text [
      <cursor />
    </block>
  </editor>
);

export const output = (
  <editor>
    <block>
      some text []
      <cursor />
    </block>
  </editor>
);
