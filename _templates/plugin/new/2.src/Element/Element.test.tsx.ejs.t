---
to: "<%= implements.elements || implements.renderElement ? `packages/${package}/src/Element${name}/Element${name}.test.tsx` : null %>"
---
import React from 'react';
import { render } from '@testing-library/react';
import Element<%= name %>, { Element<%= name %>Props } from './Element<%= name %>';

const TYPE = 'foo';
const TEXT = 'Some text';
const ID = 'element-id';

const defaultProps: Element<%= name %>Props = {
  attributes: {
    'data-slate-node': 'element',
    ref: React.createRef(),
    'data-block-id': ID,
  },
  element: { type: TYPE, children: [{ text: TEXT }], id: ID },
  children: <div>{TEXT}</div>,
};

describe('Element<%= name %>', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <Element<%= name %> {...defaultProps} />,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
