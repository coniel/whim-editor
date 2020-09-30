import React from 'react';
import { render } from '@testing-library/react';
import { UIProvider, components } from '@sheets-editor/core';
import ElementHeadingOne, { ElementHeadingOneProps } from './ElementHeadingOne';

const TYPE = 'foo';
const TEXT = 'Some text';

const defaultProps: ElementHeadingOneProps = {
  attributes: {
    'data-slate-node': 'element',
    'data-block-id': 'block-1',
    ref: React.createRef(),
  },
  element: { type: TYPE, children: [{ text: TEXT }], id: 'block-id' },
  children: <div>{TEXT}</div>,
};

describe('ElementHeadingOne', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <UIProvider components={components}>
        <ElementHeadingOne {...defaultProps} />,
      </UIProvider>,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
