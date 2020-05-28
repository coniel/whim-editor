---
to: "<%= implements.leaves || implements.renderLeaf ? `packages/${package}/src/Leaf${name}/Leaf${name}.test.tsx` : null %>"
---
import React from 'react';
import { render } from '@testing-library/react';
import Leaf<%= name %>, { Leaf<%= name %>Props } from './Leaf<%= name %>';

const TEXT = 'Some text';

const defaultProps: Leaf<%= name %>Props = {
  attributes: { 'data-slate-leaf': true },
  leaf: {
    text: TEXT,
  },
  text: {
    text: TEXT,
  },
  children: [TEXT],
};

describe('Leaf<%= name %>', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <Leaf<%= name %> {...defaultProps} leaf={{ ...defaultProps.leaf, foo: true }} />,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
