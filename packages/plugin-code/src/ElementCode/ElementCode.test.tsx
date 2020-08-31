import React from 'react';
import { render } from '@testing-library/react';
import ElementCode, { ElementCodeProps } from './ElementCode';

const TYPE = 'foo';
const TEXT = 'Some text';
const ID = 'element-id';

const defaultProps: ElementCodeProps = {
  attributes: {
    'data-slate-node': 'element',
    ref: React.createRef(),
    'data-block-id': ID,
  },
  element: { type: TYPE, children: [{ text: TEXT }], id: ID },
  children: <div>{TEXT}</div>,
  onSetLanguage: jest.fn(),
};

describe('ElementCode', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <ElementCode {...defaultProps} />,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
