---
to: "<%= implements.onDOMBeforeInput ? `packages/${package}/src/onDOMBeforeInput${name}.ts` : null %>"
---
import { SlashEditor } from '@sheets-editor/core';

function onDOMBeforeInput<%= name %>(editor: SlashEditor, event: Event): void {
  if ((event as InputEvent).inputType === 'foo') {
    return editor.addMark('foo', true);
  }
}

export default onDOMBeforeInput<%= name %>;
