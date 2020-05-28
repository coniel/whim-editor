---
to: "<%= implements.elements || implements.renderElement ? `packages/${package}/src/renderElement${name}.tsx` : null %>"
---
import React from 'react';
import { RenderElementProps } from 'slate-react';
import Element<%= name %> from './Element<%= name %>';

function render<%= name %>Element(props: RenderElementProps): JSX.Element | undefined {
  const { element } = props;

  if (element.type === 'foo') {
    return <Element<%= name %> {...props} />;
  }

  return;
}

export default render<%= name %>Element;
