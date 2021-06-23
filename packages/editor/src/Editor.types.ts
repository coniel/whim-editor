import { BraindropEditor } from '@braindrop-editor/core';
import { EditorWithRichTextPlugin } from '@braindrop-editor/plugin-rich-text';
import { EditorWithLinkPlugin } from '@braindrop-editor/plugin-link';
import { EditorWithHeadingPlugin } from '@braindrop-editor/plugin-heading';

export interface EditorWithPlugins
  extends BraindropEditor,
    EditorWithRichTextPlugin,
    EditorWithLinkPlugin,
    EditorWithHeadingPlugin {}
