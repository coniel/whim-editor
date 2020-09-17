import {
  SlashPluginFactory,
  SlashPlugin,
  SlashEditor,
} from '@sheets-editor/core';

export interface HoveringToolbarPluginOptions {
  foo?: string;
}

const HoveringToolbarPlugin = (
  options: HoveringToolbarPluginOptions = {},
): SlashPluginFactory => (editor: SlashEditor): SlashPlugin => ({});

export default HoveringToolbarPlugin;
