import React from 'react';
import { render } from '@testing-library/react';
import { UIProvider, components } from '@sheets-editor/core';
import ElementCode, { ElementCodeProps } from './ElementCode';

const TYPE = 'foo';
const TEXT = 'Some text';

const defaultProps: ElementCodeProps = {
  attributes: {
    'data-slate-node': 'element',
    ref: React.createRef(),
  },
  element: { type: TYPE, language: 'javascript', children: [{ text: TEXT }] },
  children: <div>{TEXT}</div>,
  onSetLanguage: jest.fn(),
};

describe('ElementCode', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <UIProvider components={components}>
        <ElementCode {...defaultProps} />,
      </UIProvider>,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
