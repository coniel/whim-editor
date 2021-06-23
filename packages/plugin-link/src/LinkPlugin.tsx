import React from 'react';
import isUrl from 'is-url';
import { Editor, Range, Node, Element } from 'slate';
import {
  BraindropEditorPluginFactory,
  BraindropEditor,
  Transforms,
  isNodeType,
} from '@sheets-editor/core';
import { ElementLink } from './ElementLink';
import isHotkey from 'is-hotkey';
import { EditorWithLinkPlugin, LinkElement } from './LinkPlugin.types';
import { LinkPopover } from './LinkPopover';

export interface LinkPluginOptions {
  hotkey?: string;
}

const unwrapLink = (editor: BraindropEditor): void => {
  Transforms.unwrapNodes(editor, {
    match: (n) => Element.isElement(n) && n.type === 'link',
    split: true,
  });
};

const isLinkActive = (editor: BraindropEditor): boolean => {
  const [link] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === 'link',
  });
  return !!link;
};

const wrapLink = (editor: BraindropEditor, url: string): void => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: 'link',
    id: editor.generateBlockId(),
    properties: {},
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

export const createLinkPlugin = (
  options: LinkPluginOptions = {},
): BraindropEditorPluginFactory<LinkElement> => (
  baseEditor: BraindropEditor,
) => {
  const editor = baseEditor as EditorWithLinkPlugin;
  const { normalizeNode, renderEditable } = editor;

  editor.renderEditable = (props): JSX.Element => (
    <>
      {renderEditable(props)}
      <LinkPopover />
    </>
  );

  editor.insertLink = (url: string): void => {
    if (editor.selection) {
      wrapLink(editor, url);
    }
  };

  editor.removeLink = (): void => {
    if (editor.selection) {
      unwrapLink(editor);
    }
  };

  editor.normalizeNode = (entry): void => {
    const [baseNode, path] = entry;
    const node = baseNode as LinkElement;

    if (isNodeType(entry, { allow: ['link'] })) {
      // Don't allow links without a URL
      if (!node.properties.url) {
        Transforms.unwrapNodes(editor, {
          match: (n) => Element.isElement(n) && n.type === 'link',
          split: true,
          at: path,
        });
      }

      // Don't allow nested links
      const descendants = Node.descendants(node);
      const links = Array.from(descendants).filter((descEntry) =>
        isNodeType(descEntry, { allow: ['link'] }),
      );

      links.forEach((link) => {
        Transforms.unwrapNodes(editor, {
          match: (n) => Element.isElement(n) && n.type === 'link',
          split: true,
          at: link[1],
        });
      });
    }

    return normalizeNode(entry);
  };

  return {
    elementDeserializers: {
      A: (el) => {
        const a = el as HTMLAnchorElement;
        if (a.href) {
          return { type: 'link', url: a.href };
        }
      },
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>): void => {
      if (
        isHotkey(options.hotkey || 'mod+k', (event as unknown) as KeyboardEvent)
      ) {
        (editor as EditorWithLinkPlugin).openLinkPopover();
      }
    },
    elements: [
      {
        type: 'link',
        component: ElementLink,
        isInline: true,
      },
    ],
    insertData: (data): void | boolean => {
      const text = data.getData('text/plain');

      if (text && isUrl(text)) {
        if (editor.selection) {
          wrapLink(editor, text);
        } else {
          Transforms.insertNodes(editor, {
            type: 'link',
            properties: { url: text },
            id: editor.generateBlockId(),
            children: [{ text }],
          });
        }

        return true;
      }
    },
  };
};
