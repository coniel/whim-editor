import React from 'react';
import { render } from '@testing-library/react';
import { Popover } from './Popover';

const defaultProps = {
  open: true,
  onClose: jest.fn(),
};

describe('EquationError', () => {
  it('should render children', () => {
    const { getByText } = render(<Popover {...defaultProps}>CHILDREN</Popover>);
    getByText('CHILDREN');
  });
});
