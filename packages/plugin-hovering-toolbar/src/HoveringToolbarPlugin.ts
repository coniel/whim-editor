import { BraindropEditorPluginFactory } from '@braindrop-editor/core';

export interface HoveringToolbarPluginOptions {
  foo?: string;
}

export const createHoveringToolbarPlugin = (): BraindropEditorPluginFactory => () => ({});
