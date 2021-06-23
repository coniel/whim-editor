---
to: "<%= implements.onKeyDown ? `packages/${package}/src/onKeyDown${name}.ts` : null %>"
---
import { BraindropEditor } from '@braindrop-editor/core';

function onKeyDown<%= name %>(editor: BraindropEditor, event: KeyboardEvent): void {
  if (event.key === 'somekey') {
    event.preventDefault();
    // Do something
  }
}

export default onKeyDown<%= name %>;
