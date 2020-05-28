---
to: "<%= implements.leaves || implements.renderLeaf ? `packages/${package}/src/Leaf${name}/Leaf${name}.tsx` : null %>"
---
import React from 'react';
import { RenderLeafProps } from 'slate-react';

export interface Leaf<%= name %>Props extends RenderLeafProps {
  foo?: string;
}

const Leaf<%= name %>: React.FC<Leaf<%= name %>Props> = ({ children, leaf }) => {
  return <span style={{ color: 'blue' }}>{children}</span>;
};

export default Leaf<%= name %>;
