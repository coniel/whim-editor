import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import VoidBlock from './VoidBlock';

describe('EquationError', () => {
  it('should render children', () => {
    const { getByText } = render(<VoidBlock>CHILDREN</VoidBlock>);
    getByText('CHILDREN');
  });
  it('should spread other props to root', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <VoidBlock onClick={handleClick}>CHILDREN</VoidBlock>,
    );
    fireEvent.click(getByText('CHILDREN'));

    expect(handleClick).toHaveBeenCalled();
  });
});
