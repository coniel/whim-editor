---
to: "<%= implements.leaves || implements.renderLeaf ? `packages/${package}/src/renderLeaf${name}.tsx` : null %>"
---
import React from 'react';
import { RenderLeafProps } from 'slate-react';
import Leaf<%= name %> from './Leaf<%= name %>';

function render<%= name %>Leaf(props: RenderLeafProps): JSX.Element {
  let { children } = props;
  const { leaf } = props;

  if (leaf.foo) {
    children = <Leaf<%= name %> {...props} />;
  }

  return children;
}

export default render<%= name %>Leaf;
