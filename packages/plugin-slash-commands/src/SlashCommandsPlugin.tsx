import React from 'react';
import {
  SlashPluginFactory,
  SlashPlugin,
  SlashEditor,
} from '@sheets-editor/core';
import { onKeyDownSlashCommands } from './onKeyDownSlashCommands';
import { ElementSlashQuery } from './ElementSlashQuery';
import { MenuItem } from './SlashCommandsPlugin.types';

export interface SlashCommandsPluginOptions {
  menuItems: MenuItem[];
}

export const createSlashCommandsPlugin = (
  options: SlashCommandsPluginOptions,
): SlashPluginFactory => (editor: SlashEditor): SlashPlugin => ({
  onKeyDown: (event) =>
    onKeyDownSlashCommands(editor, (event as unknown) as KeyboardEvent),
  elements: [
    {
      returnBehaviour: 'soft-break',
      isInline: true,
      isVoid: false,
      type: 'slash-query',
      component: (props) => (
        <ElementSlashQuery {...props} menuItems={options.menuItems} />
      ),
    },
  ],
});
