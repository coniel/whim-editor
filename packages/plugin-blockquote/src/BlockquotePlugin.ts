import {
  SlashPluginFactory,
  SlashPlugin,
  SlashPluginElementDescriptor,
} from '@sheets-editor/core';
import ElementBlockquote from './ElementBlockquote';

export interface BlockquotePluginOptions {
  blockquote?: Partial<SlashPluginElementDescriptor>;
}

const BlockquotePlugin = (
  options: BlockquotePluginOptions = {},
): SlashPluginFactory => (): SlashPlugin => ({
  elements: [
    {
      type: 'blockquote',
      component: ElementBlockquote,
      shortcuts: ['" '],
      ...(options.blockquote || {}),
    },
  ],
});

export default BlockquotePlugin;
