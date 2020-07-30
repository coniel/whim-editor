import React from 'react';
import { render } from '@testing-library/react';
import ElementBlock, { ElementBlockProps } from './ElementBlock';

const TYPE = 'foo';
const TEXT = 'Some text';

const defaultProps: ElementBlockProps = {
  attributes: { 'data-slate-node': 'element', ref: React.createRef() },
  element: { type: TYPE, children: [{ text: TEXT }] },
  children: <div>{TEXT}</div>,
};

describe('ElementBlock', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <ElementBlock {...defaultProps} />,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
