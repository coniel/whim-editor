import React from 'react';
import { render } from '@testing-library/react';
import ElementHeadingThree, {
  ElementHeadingThreeProps,
} from './ElementHeadingThree';

const TYPE = 'foo';
const TEXT = 'Some text';

const defaultProps: ElementHeadingThreeProps = {
  attributes: { 'data-slate-node': 'element', ref: React.createRef() },
  element: { type: TYPE, children: [{ text: TEXT }] },
  children: <div>{TEXT}</div>,
};

describe('ElementHeadingThree', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <ElementHeadingThree {...defaultProps} />,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
