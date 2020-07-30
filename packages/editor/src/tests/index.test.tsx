import React from 'react';
import assert from 'assert';
import { fixtures, withTest } from '@slash/test-utils';
import { SlashPluginFactory } from '../withPlugins';
import { Transforms } from 'slate';

const Plugin: SlashPluginFactory = (editor) => ({
  leaves: [
    {
      mark: 'b',
      component: 'strong',
      shortcuts: [{ start: '**', end: '**' }],
    },
    {
      mark: 'i',
      component: 'em',
      shortcuts: [{ start: '*', end: '*' }],
    },
  ],
  elements: [
    {
      type: 'to-do',
      component: ({ children, attributes }): React.ReactElement => (
        <div {...attributes}>foo{children}</div>
      ),
      shortcuts: ['[]'],
    },
    {
      type: 'unordered-list',
      component: ({ children, attributes }): React.ReactElement => (
        <div {...attributes}>{children}</div>
      ),
      turnInto: (): void => {
        Transforms.setNodes(editor, { type: 'unordered-list' });
      },
      shortcuts: ['- '],
    },
  ],
});

describe('slate', () => {
  fixtures(__dirname, 'mark-shortcuts', ({ module }) => {
    const { input, run, output } = module;
    const editor = withTest(input, [Plugin]);

    run(editor);

    assert.deepEqual(editor.children, output.children);
    assert.deepEqual(editor.selection, output.selection);
  });

  fixtures(__dirname, 'block-shortcuts', ({ module }) => {
    const { input, run, output } = module;
    const editor = withTest(input, [Plugin]);

    run(editor);

    assert.deepEqual(editor.children, output.children);
    expect(editor.selection).not.toBeNull();
    expect(output.selection).not.toBeNull();
    if (editor.selection && output.selection) {
      expect(editor.selection.anchor.path[0]).toEqual(
        output.selection.anchor.path[0],
      );
      expect(editor.selection.anchor.path[0]).toEqual(
        output.selection.anchor.path[0],
      );
      expect(editor.selection.focus.offset).toEqual(
        output.selection.focus.offset,
      );
    }
  });
});
