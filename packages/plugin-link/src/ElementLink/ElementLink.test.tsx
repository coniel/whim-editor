import React from 'react';
import { render } from '@testing-library/react';
import { ElementLink, ElementLinkProps } from './ElementLink';

const TYPE = 'foo';
const TEXT = 'Some text';

const defaultProps: ElementLinkProps = {
  attributes: {
    'data-slate-node': 'element',
    ref: React.createRef(),
  },
  element: {
    type: TYPE,
    id: '1',
    url: 'https://ibguides.com',
    children: [{ text: TEXT }],
  },
  children: <div>{TEXT}</div>,
};

describe('ElementLink', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <ElementLink {...defaultProps} />,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
