---
inject: true
to: "<%= implements.elements || implements.renderElement ? `packages/${package}/src/index.ts` : null %>"
append: true
---

export { default as Element<%= name %> } from './Element<%= name %>';
export * from './Element<%= name %>';