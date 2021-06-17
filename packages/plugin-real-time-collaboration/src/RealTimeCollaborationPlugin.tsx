import Pusher from 'pusher-js';
import { v4 as uuid } from 'uuid';
import {
  SlashPluginFactory,
  SlashPlugin,
  SlashEditor,
} from '@sheets-editor/core';

export interface RealTimeCollaborationPluginOptions {
  apiKey: string;
  cluster: string;
  authEndpoint: string;
  channel: string;
}

const RealTimeCollaborationPlugin = ({
  apiKey,
  cluster,
  authEndpoint,
  channel: channelName,
}: RealTimeCollaborationPluginOptions): SlashPluginFactory => (
  editor: SlashEditor,
): SlashPlugin => {
  const session = uuid();
  const pusher = new Pusher(apiKey, {
    cluster,
    authEndpoint,
  });
  const channel = pusher.subscribe(channelName);

  channel.bind('client-editor-operation', function (data: any) {
    if (data.session !== session) {
      editor.apply(data);
    }
  });

  const { apply } = editor;

  editor.apply = (operation): void => {
    if (operation.type !== 'set_selection') {
      // && !operation.foreign
      channel.trigger('client-editor-operation', {
        ...operation,
        foreign: true,
        session,
      });
    }
    return apply(operation);
  };

  return {};
};

export default RealTimeCollaborationPlugin;
