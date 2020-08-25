import React from 'react';
import { render } from '@testing-library/react';
import ElementLink, { ElementLinkProps } from './ElementLink';

const TYPE = 'foo';
const TEXT = 'Some text';
const ID = 'element-id';

const defaultProps: ElementLinkProps = {
  attributes: {
    'data-slate-node': 'element',
    ref: React.createRef(),
    'data-block-id': ID,
  },
  element: { type: TYPE, children: [{ text: TEXT }], id: ID },
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
