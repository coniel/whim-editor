import React from 'react';
import { render } from '@testing-library/react';
import ElementParagraph, { ElementParagraphProps } from './ElementParagraph';

const TYPE = 'foo';
const TEXT = 'Some text';
const ID = 'element-id';

const defaultProps: ElementParagraphProps = {
  attributes: {
    'data-slate-node': 'element',
    ref: React.createRef(),
    'data-block-id': ID,
  },
  element: { type: TYPE, children: [{ text: TEXT }], id: ID },
  children: <div>{TEXT}</div>,
};

describe('ElementParagraph', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <ElementParagraph {...defaultProps} />,
    );

    expect(baseElement).toBeTruthy();
    getByText(TEXT);
  });
});
