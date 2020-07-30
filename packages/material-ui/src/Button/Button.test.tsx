import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('EquationError', () => {
  it('should render children', () => {
    const { getByText } = render(<Button>CHILDREN</Button>);
    getByText('CHILDREN');
  });

  it('should render startIcon', () => {
    const { getByText } = render(
      <Button startIcon="START ICON">CHILDREN</Button>,
    );
    getByText('START ICON');
  });

  it('should render endIcon', () => {
    const { getByText } = render(<Button endIcon="END ICON">CHILDREN</Button>);
    getByText('END ICON');
  });

  it('should bind onClick', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button onClick={handleClick}>Click me</Button>,
    );
    fireEvent.click(getByText('Click me'));

    expect(handleClick).toHaveBeenCalled();
  });

  it('should set the type attribute', () => {
    const { getByText } = render(<Button type="submit">Submit button</Button>);

    expect(getByText('Submit button').parentElement).toHaveAttribute(
      'type',
      'submit',
    );
  });
});
