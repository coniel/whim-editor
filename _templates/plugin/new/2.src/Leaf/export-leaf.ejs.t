---
inject: true
to: "<%= implements.leaves || implements.renderLeaf ? `packages/${package}/src/index.ts` : null %>"
append: true
---

export { default as Leaf<%= name %> } from './Leaf<%= name %>';
export * from './Leaf<%= name %>';