import React from 'react';
import { render } from '@testing-library/react';
import ElementOrderedList, {
  ElementOrderedListProps,
} from './ElementOrderedList';
import { SlashEditor } from '@sheets-editor/core/src';

const TYPE = 'foo';
const TEXT = 'Some text';
const ID = 'element-id';

const defaultProps: ElementOrderedListProps = {
  attributes: {
    'data-slate-node': 'element',
    ref: React.createRef(),
    'data-block-id': ID,
  },
  element: { type: TYPE, children: [{ text: TEXT }], id: ID },
  children: <div>{TEXT}</div>,
  editor: {} as SlashEditor,
};

describe('ElementOrderedList', () => {
  it('should render successfully', () => {
    // const { baseElement, getByText } = render(
    //   <ElementOrderedList {...defaultProps} />,
    // );
    // expect(baseElement).toBeTruthy();
    // getByText(TEXT);
  });
});
