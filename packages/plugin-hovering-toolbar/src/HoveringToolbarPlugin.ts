import { SlashPluginFactory } from '@sheets-editor/core';

export interface HoveringToolbarPluginOptions {
  foo?: string;
}

export const createHoveringToolbarPlugin = (): SlashPluginFactory => () => ({});
