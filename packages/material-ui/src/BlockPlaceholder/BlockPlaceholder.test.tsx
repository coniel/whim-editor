import React from 'react';
import { render } from '@testing-library/react';
import { BlockPlaceholder } from './BlockPlaceholder';

describe('EquationError', () => {
  it('should render the label', () => {
    const { getByText } = render(<BlockPlaceholder label="LABEL" />);
    getByText('LABEL');
  });

  it('should render the icon', () => {
    const { getByText } = render(
      <BlockPlaceholder label="LABEL" icon="ICON" />,
    );
    getByText('ICON');
  });
});
