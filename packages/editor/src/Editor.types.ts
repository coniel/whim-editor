import { BraindropEditor } from '@sheets-editor/core';
import { EditorWithRichTextPlugin } from '@sheets-editor/plugin-rich-text';
import { EditorWithLinkPlugin } from '@sheets-editor/plugin-link';
import { EditorWithHeadingPlugin } from '@sheets-editor/plugin-heading';

export interface EditorWithPlugins
  extends BraindropEditor,
    EditorWithRichTextPlugin,
    EditorWithLinkPlugin,
    EditorWithHeadingPlugin {}
