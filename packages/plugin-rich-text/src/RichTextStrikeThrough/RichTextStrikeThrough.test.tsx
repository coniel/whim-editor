import React from 'react';
import { render } from '@testing-library/react';
import StrikeThrough from './RichTextStrikeThrough';

describe('RichTextLeaf', () => {
  it('should render as expected', () => {
    expect(
      render(<StrikeThrough>Strike through text</StrikeThrough>).asFragment(),
    ).toMatchSnapshot();
  });
});
