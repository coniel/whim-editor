import {
  SlashPluginFactory,
  SlashPlugin,
  SlashPluginElementDescriptor,
} from '@sheets-editor/core';
import ElementUnorderedList from './ElementUnorderedList';

export type UnorderedListPluginOptions = Partial<
  Pick<
    SlashPluginElementDescriptor,
    | 'type'
    | 'shortcuts'
    | 'component'
    | 'hotkeys'
    | 'insert'
    | 'turnInto'
    | 'returnBehaviour'
  >
>;

const UnorderedListPlugin = (
  options: UnorderedListPluginOptions = {},
): SlashPluginFactory => (): SlashPlugin => ({
  elements: [
    {
      type: 'ul',
      shortcuts: ['- ', '* ', '+ '],
      component: ElementUnorderedList,
      returnBehaviour: 'same-type',
      ...options,
    },
  ],
});

export default UnorderedListPlugin;
