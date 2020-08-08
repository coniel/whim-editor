---
to: packages/<%= package %>/src/<%= name %>Plugin.ts
---
import { SlashPluginFactory, SlashPlugin, SlashEditor } from '@sheets-editor/editor';
<% if(implements.leaves || implements.renderLeaf){ -%>
import renderLeaf<%= name %> from './renderLeaf<%= name %>';
<% } -%>
<% if(implements.elements || implements.renderElement){ -%>
import renderElement<%= name %> from './renderElement<%= name %>';
<% } -%>
<% if(implements.onDOMBeforeInput){ -%>
import onDOMBeforeInput<%= name %> from './onDOMBeforeInput<%= name %>';
<% } -%>
<% if(implements.onKeyDown){ -%>
import onKeyDown<%= name %> from './onKeyDown<%= name %>';
<% } -%>

export interface <%= name %>PluginOptions {
  foo?: string;
}

const <%= name %>Plugin = (options: <%= name %>PluginOptions = {}): SlashPluginFactory => (
  editor: SlashEditor,
): SlashPlugin => ({
<% if(implements.leaves || implements.renderLeaf){ -%>
  renderLeaf: (props): JSX.Element => renderLeaf<%= name %>(props),
<% } -%>
<% if(implements.elements || implements.renderElement){ -%>
  renderElement: (props): JSX.Element | undefined => renderElement<%= name %>(props),
<% } -%>
<% if(implements.onDOMBeforeInput){ -%>
  onDOMBeforeInput: (event): void => onDOMBeforeInput<%= name %>(editor, event),
<% } -%>
<% if(implements.onKeyDown){ -%>
  onKeyDown: (event): void =>
    onKeyDown<%= name %>(editor, (event as unknown) as KeyboardEvent),
<% } -%>
});

export default <%= name %>Plugin;
