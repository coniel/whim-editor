---
to: "<%= implements.onDOMBeforeInput ? `packages/${package}/src/onDOMBeforeInput${name}.ts` : null %>"
---
import { BraindropEditor } from '@braindrop-editor/core';

function onDOMBeforeInput<%= name %>(editor: BraindropEditor, event: Event): void {
  if ((event as InputEvent).inputType === 'foo') {
    return editor.addMark('foo', true);
  }
}

export default onDOMBeforeInput<%= name %>;
