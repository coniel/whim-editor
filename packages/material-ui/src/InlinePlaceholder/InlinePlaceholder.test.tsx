import React from 'react';
import { render } from '@testing-library/react';
import { InlinePlaceholder } from './InlinePlaceholder';

describe('EquationError', () => {
  it('should render the label', () => {
    const { getByText } = render(<InlinePlaceholder label="LABEL" />);
    getByText('LABEL');
  });

  it('should render the icon', () => {
    const { getByText } = render(
      <InlinePlaceholder label="LABEL" icon="ICON" />,
    );
    getByText('ICON');
  });
});
