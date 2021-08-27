import React from 'react';
import { render } from '@testing-library/react';
import { UIProvider, components } from '@braindrop-editor/core';
import { ElementBlockquote, ElementBlockquoteProps } from './ElementBlockquote';

const TYPE = 'blockquote';
const TEXT = 'Some text';

const defaultProps: ElementBlockquoteProps = {
  attributes: {
    'data-slate-node': 'element',
    ref: React.createRef(),
  },
  element: { type: TYPE, id: 'id', children: [{ text: TEXT }] },
  children: <div>{TEXT}</div>,
};

describe('ElementBlockquote', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <UIProvider components={components}>
        <ElementBlockquote {...defaultProps} />,
      </UIProvider>,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
