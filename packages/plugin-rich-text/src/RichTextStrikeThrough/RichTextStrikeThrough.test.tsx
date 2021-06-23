import React from 'react';
import { render } from '@testing-library/react';
import { RichTextStrikeThrough } from './RichTextStrikeThrough';

describe('RichTextLeaf', () => {
  it('should render as expected', () => {
    expect(
      render(
        <RichTextStrikeThrough>Strike through text</RichTextStrikeThrough>,
      ).asFragment(),
    ).toMatchSnapshot();
  });
});
