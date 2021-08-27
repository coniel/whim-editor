import React from 'react';
import { render } from '@testing-library/react';
import { ElementToDoList, ElementToDoListProps } from './ElementToDoList';

const TYPE = 'foo';
const TEXT = 'Some text';

const defaultProps: ElementToDoListProps = {
  attributes: {
    'data-slate-node': 'element',
    ref: React.createRef(),
  },
  onClickCheckbox: jest.fn(),
  element: {
    type: TYPE,
    id: '1',
    done: false,
    children: [{ text: TEXT }],
  },
  children: <div>{TEXT}</div>,
};

describe('ElementToDoList', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <ElementToDoList {...defaultProps} />,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
