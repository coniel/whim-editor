import React from 'react';
import { render } from '@testing-library/react';
import { components } from '../test-utils';
import { Editor } from './Editor';

const value = [
  {
    type: 'text',
    id: '1',
    children: [{ text: 'Hello world' }],
  },
];
const onChange = jest.fn();

describe('Editor', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <Editor components={components} value={value} onChange={onChange} />,
    );

    expect(baseElement).toBeTruthy();

    // Both renderElement and renderLeaf
    // are called to render the content.
    // So this tests both.
    getByText('Hello world');
  });

  it('should render the placeholder', () => {
    const { getByText } = render(
      <Editor
        components={components}
        value={value}
        onChange={onChange}
        placeholder="Hello world"
      />,
    );

    getByText('Hello world');
  });

  it('should render its children', () => {
    const { getByText } = render(
      <Editor components={components} value={value} onChange={onChange}>
        Children
      </Editor>,
    );

    getByText('Children');
  });
});
