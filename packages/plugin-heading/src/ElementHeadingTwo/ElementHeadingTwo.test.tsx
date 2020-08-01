import React from 'react';
import { render } from '@testing-library/react';
import ElementHeadingTwo, { ElementHeadingTwoProps } from './ElementHeadingTwo';

const TYPE = 'foo';
const TEXT = 'Some text';

const defaultProps: ElementHeadingTwoProps = {
  attributes: { 'data-slate-node': 'element', ref: React.createRef() },
  element: { type: TYPE, children: [{ text: TEXT }] },
  children: <div>{TEXT}</div>,
};

describe('ElementHeadingTwo', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <ElementHeadingTwo {...defaultProps} />,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
