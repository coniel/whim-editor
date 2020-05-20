import React from 'react';
import { render } from '@testing-library/react';
import Editor from './Editor';

const value = [{ type: 'text', children: [{ text: 'Hello Slash' }] }];
const onChange = jest.fn();

describe('Editor', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <Editor value={value} onChange={onChange} />,
    );

    expect(baseElement).toBeTruthy();

    // Both renderElement and renderLeaf
    // are called to render the content.
    // So this tests both.
    getByText('Hello Slash');
  });

  it('should render the placeholder', () => {
    const { getByText } = render(
      <Editor value={value} onChange={onChange} placeholder="Hello Slash" />,
    );

    getByText('Hello Slash');
  });

  it('should render its children', () => {
    const { getByText } = render(
      <Editor value={value} onChange={onChange}>
        Children
      </Editor>,
    );

    getByText('Children');
  });
});
