---
to: "<%= implements.onKeyDown ? `packages/${package}/src/onKeyDown${name}.ts` : null %>"
---
import { SlashEditor } from '@sheets-editor/editor';

function onKeyDown<%= name %>(editor: SlashEditor, event: KeyboardEvent): void {
  if (event.key === 'somekey') {
    event.preventDefault();
    // Do something
  }
}

export default onKeyDown<%= name %>;
