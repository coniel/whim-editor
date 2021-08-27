import React from 'react';
import { render } from '@testing-library/react';
import { BlockPluginContextValue } from '../BlockPluginProvider';
import { ElementBlock, ElementBlockProps } from './ElementBlock';

jest.mock('../BlockPluginProvider', () => ({
  useBlockPlugin: (): Partial<BlockPluginContextValue> => ({
    selectedBlocks: [
      {
        id: 'block-id',
        type: 'text',
        children: [{ text: '' }],
        path: [0, 0],
        rect: {
          x: 0,
          y: 0,
          width: 100,
          height: 50,
          bottom: 200,
          left: 0,
          top: 0,
          right: 0,
          toJSON: () => '',
        },
      },
    ],
  }),
}));

const defaultProps: ElementBlockProps = {
  id: 'block-id',
};

describe('ElementBlock', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ElementBlock {...defaultProps} />);
    expect(baseElement).toBeTruthy();
  });

  it('should render children', () => {
    const { getByText } = render(
      <ElementBlock {...defaultProps}>CHILDREN</ElementBlock>,
    );
    getByText('CHILDREN');
  });

  it('should render halo when block is selected', () => {
    const block = render(
      <ElementBlock {...defaultProps}>CHILDREN</ElementBlock>,
    ).asFragment();

    expect(block).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div>
          CHILDREN
          <div
            style="position: absolute; transition: opacity 0.2s linear; top: 0px; right: -2px; bottom: 0px; left: -2px; pointer-events: none; background-color: rgba(46, 170, 220, 0.2); opacity: 0;"
          />
        </div>
      </DocumentFragment>
    `);
  });
});
