import React from 'react';
import { render } from '@testing-library/react';
import { UIProvider, components } from '@braindrop-editor/core';
import { ElementCodeProps, ElementCode } from './ElementCode';

const TYPE = 'foo';
const TEXT = 'Some text';

const defaultProps: ElementCodeProps = {
  attributes: {
    'data-slate-node': 'element',
    ref: React.createRef(),
  },
  element: {
    type: TYPE,
    id: '1',
    properties: { language: 'javascript' },
    children: [{ text: TEXT }],
  },
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
