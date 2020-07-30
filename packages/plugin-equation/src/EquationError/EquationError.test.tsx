import React from 'react';
import { render } from '@testing-library/react';
import EquationError from './EquationError';

describe('EquationError', () => {
  it('should render the error text', () => {
    const { getByText } = render(<EquationError error="ERROR TEXT" />);
    getByText('ERROR TEXT');
  });
});
