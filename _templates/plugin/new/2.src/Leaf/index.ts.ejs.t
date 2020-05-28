---
to: "<%= implements.leaves || implements.renderLeaf ? `packages/${package}/src/Leaf${name}/index.ts` : null %>"
---
export { default } from './Leaf<%= name %>';
export * from './Leaf<%= name %>';
