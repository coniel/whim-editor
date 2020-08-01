import React from 'react';
import { render } from '@testing-library/react';
import ElementHeadingOne, { ElementHeadingOneProps } from './ElementHeadingOne';

const TYPE = 'foo';
const TEXT = 'Some text';

const defaultProps: ElementHeadingOneProps = {
  attributes: { 'data-slate-node': 'element', ref: React.createRef() },
  element: { type: TYPE, children: [{ text: TEXT }] },
  children: <div>{TEXT}</div>,
};

describe('ElementHeadingOne', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <ElementHeadingOne {...defaultProps} />,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
