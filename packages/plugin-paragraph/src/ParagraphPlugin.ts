import { SlashPluginFactory, SlashPlugin } from '@sheets-editor/core';
import { ElementParagraph } from './ElementParagraph';

export interface ParagraphPluginOptions {
  type?: string;
}

export const createParagraphPlugin = (
  options: ParagraphPluginOptions = {},
): SlashPluginFactory => (): SlashPlugin => ({
  elementDeserializers: {
    P: () => {
      return { type: options.type || 'paragraph' };
    },
    '*': (el, children, parent) => {
      if (parent && parent.nodeName === 'DIV') {
        return { type: options.type || 'paragraph' };
      }
    },
  },
  elements: [
    {
      type: options.type || 'paragraph',
      component: ElementParagraph,
      returnBehaviour: 'same-type',
    },
  ],
});
