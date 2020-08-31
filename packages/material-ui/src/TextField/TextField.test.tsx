import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TextField from './TextField';

describe('EquationError', () => {
  it('should render children', () => {
    const { getByText } = render(<TextField>CHILDREN</TextField>);
    getByText('CHILDREN');
  });
  it('should spread other props to root', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <TextField onClick={handleClick}>CHILDREN</TextField>,
    );
    fireEvent.click(getByText('CHILDREN'));

    expect(handleClick).toHaveBeenCalled();
  });
});
