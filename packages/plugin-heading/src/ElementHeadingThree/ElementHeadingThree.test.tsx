import React from 'react';
import { render } from '@testing-library/react';
import ElementHeadingThree, {
  ElementHeadingThreeProps,
} from './ElementHeadingThree';

const TYPE = 'foo';
const TEXT = 'Some text';

const defaultProps: ElementHeadingThreeProps = {
  attributes: {
    'data-slate-node': 'element',
    'data-block-id': 'block-1',
    ref: React.createRef(),
  },
  element: { type: TYPE, children: [{ text: TEXT }], id: 'block-id' },
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
