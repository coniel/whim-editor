import React from 'react';
import { render } from '@testing-library/react';
import { UIProvider, components } from '@braindrop-editor/core';
import { ElementParagraph, ElementParagraphProps } from './ElementParagraph';

const TYPE = 'foo';
const TEXT = 'Some text';

const defaultProps: ElementParagraphProps = {
  attributes: {
    'data-slate-node': 'element',
    ref: React.createRef(),
  },
  element: { type: TYPE, id: '1', children: [{ text: TEXT }] },
  children: <div>{TEXT}</div>,
};

describe('ElementParagraph', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <UIProvider components={components}>
        <ElementParagraph {...defaultProps} />,
      </UIProvider>,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
