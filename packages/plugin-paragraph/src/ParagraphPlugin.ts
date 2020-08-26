import { SlashPluginFactory, SlashPlugin } from '@sheets-editor/core';
import ElementParagraph from './ElementParagraph';

export interface ParagraphPluginOptions {
  type?: string;
}

const ParagraphPlugin = (
  options: ParagraphPluginOptions = {},
): SlashPluginFactory => (): SlashPlugin => ({
  elements: [
    {
      type: options.type || 'paragraph',
      component: ElementParagraph,
      returnBehaviour: 'same-type',
    },
  ],
});

export default ParagraphPlugin;
