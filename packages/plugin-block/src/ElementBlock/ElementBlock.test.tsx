import React from 'react';
import { render } from '@testing-library/react';
import { BlockPluginContextValue } from '../BlockPluginProvider';
import ElementBlock, { ElementBlockProps } from './ElementBlock';

jest.mock('../BlockPluginProvider', () => ({
  useBlockPlugin: (): Partial<BlockPluginContextValue> => ({
    selectedBlocks: [
      { id: 'block-id', type: 'text', children: [{ text: '' }] },
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
        <div
          style="position: relative; margin: 2px 0px; padding: 3px 2px;"
        >
          CHILDREN
          <div
            style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; pointer-events: none; background-color: rgba(46, 170, 220, 0.2);"
          />
        </div>
      </DocumentFragment>
    `);
  });
});
