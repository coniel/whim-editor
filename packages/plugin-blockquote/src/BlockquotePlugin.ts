import { SlashPluginFactory, ElementComponent } from '@sheets-editor/core';
import { ElementBlockquote } from './ElementBlockquote';
import { BlockquoteElement } from './BlockquotePlugin.types';

export interface BlockquotePluginOptions {
  type?: string;
  shortcuts?: string[];
  hotkeys?: string[];
  component?: ElementComponent<BlockquoteElement>;
}

export const createBlockquotePlugin = (
  options: BlockquotePluginOptions = {},
): SlashPluginFactory<BlockquoteElement> => () => ({
  elements: [
    {
      type: 'blockquote',
      component: ElementBlockquote,
      shortcuts: ['" '],
      ...options,
    },
  ],
});
