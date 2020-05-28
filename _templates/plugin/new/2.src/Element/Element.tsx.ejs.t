---
to: "<%= implements.elements || implements.renderElement ? `packages/${package}/src/Element${name}/Element${name}.tsx` : null %>"
---
import React from 'react';
import { RenderElementProps } from 'slate-react';

export interface Element<%= name %>Props extends RenderElementProps {
  foo?: string;
}

const Element<%= name %>: React.FC<Element<%= name %>Props> = ({
  attributes,
  children,
  element,
}) => {
  return <div {...attributes}>{children}</div>;
};

export default Element<%= name %>;
