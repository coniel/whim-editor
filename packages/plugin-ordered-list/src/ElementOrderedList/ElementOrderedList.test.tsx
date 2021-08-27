import React from 'react';
import { ElementOrderedListProps } from './ElementOrderedList';

const TYPE = 'foo';
const TEXT = 'Some text';

const defaultProps: ElementOrderedListProps = {
  attributes: {
    'data-slate-node': 'element',
    ref: React.createRef(),
  },
  element: {
    type: TYPE,
    number: 1,
    id: '1',
    children: [{ text: TEXT }],
  },
  children: <div>{TEXT}</div>,
};

describe('ElementOrderedList', () => {
  it('should render successfully', () => {
    // const { baseElement, getByText } = render(
    //   <ElementOrderedList {...defaultProps} />,
    // );
    // expect(baseElement).toBeTruthy();
    // getByText(TEXT);
  });
});
