---
to: "<%= implements.elements || implements.renderElement ? `packages/${package}/src/Element${name}/index.ts` : null %>"
---
export { default } from './Element<%= name %>';
export * from './Element<%= name %>';
