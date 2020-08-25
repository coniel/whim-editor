import isUrl from 'is-url';
import { Editor, Range } from 'slate';
import {
  SlashPluginFactory,
  SlashPlugin,
  SlashEditor,
  Transforms,
} from '@sheets-editor/core';
import ElementLink from './ElementLink';

export interface LinkPluginOptions {
  foo?: string;
}

const unwrapLink = (editor: SlashEditor): void => {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === 'link' });
};

const isLinkActive = (editor: SlashEditor): boolean => {
  const [link] = Editor.nodes(editor, { match: (n) => n.type === 'link' });
  return !!link;
};

const wrapLink = (editor: SlashEditor, url: string): void => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

const withLinks = (editor: SlashEditor): void => {
  const { insertData, insertText } = editor;

  editor.insertLink = (url: string): void => {
    if (editor.selection) {
      wrapLink(editor, url);
    }
  };

  editor.insertText = (text): void => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data): void => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };
};

const LinkPlugin = (options: LinkPluginOptions = {}): SlashPluginFactory => (
  editor: SlashEditor,
): SlashPlugin => {
  withLinks(editor);
  return {
    elements: [
      {
        type: 'link',
        component: ElementLink,
        isInline: true,
      },
    ],
  };
};

export default LinkPlugin;
