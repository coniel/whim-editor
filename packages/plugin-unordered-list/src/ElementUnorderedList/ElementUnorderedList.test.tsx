import React from 'react';
import { render } from '@testing-library/react';
import { UIProvider, components } from '@braindrop-editor/core';
import {
  ElementUnorderedList,
  ElementUnorderedListProps,
} from './ElementUnorderedList';

const TYPE = 'foo';
const TEXT = 'Some text';

const defaultProps: ElementUnorderedListProps = {
  attributes: {
    'data-slate-node': 'element',
    ref: React.createRef(),
  },
  element: { type: TYPE, id: '1', children: [{ text: TEXT }] },
  children: <div>{TEXT}</div>,
};

describe('ElementUnorderedList', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <UIProvider components={components}>
        <ElementUnorderedList {...defaultProps} />,
      </UIProvider>,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
