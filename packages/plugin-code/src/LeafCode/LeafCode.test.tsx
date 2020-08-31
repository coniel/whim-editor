import React from 'react';
import { render } from '@testing-library/react';
import LeafCode, { LeafCodeProps } from './LeafCode';

const TEXT = 'foo = 3';

const defaultProps: LeafCodeProps = {
  leaf: { code: true, text: TEXT },
  children: <div>{TEXT}</div>,
  text: { text: TEXT },
  attributes: { 'data-slate-leaf': true },
};

describe('LeafCode', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(<LeafCode {...defaultProps} />);

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
