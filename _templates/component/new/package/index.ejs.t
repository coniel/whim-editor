---
inject: true
to: packages/<%= package %>/src/index.ts
append: true
---
export { default as <%= name %> } from './<%= name %>';
export * from './<%= name %>';