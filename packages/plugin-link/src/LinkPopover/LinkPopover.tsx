import React, { useEffect, useState, useCallback } from 'react';
import isUrl from 'is-url';
import { useSlate, ReactEditor, useEditor } from 'slate-react';
import { Node, NodeEntry, Path, Range } from 'slate';
import {
  useUI,
  Transforms,
  getBlockAbove,
  isNodeType,
  useEditorState,
} from '@sheets-editor/core';
import { EditorWithLinkPlugin } from '../LinkPlugin.types';

function getNodeLinks(node: Node, from: Path, to: Path): NodeEntry[] {
  const descendants = Node.elements(node, {
    from,
    to,
    reverse: Path.isAfter(from, to),
  });

  return Array.from(descendants).filter((desc) =>
    isNodeType(desc, { allow: ['link'] }),
  );
}

export const LinkPopover: React.FC = () => {
  const { Popover, TextField, Button } = useUI();
  const { toggle, turnOff, turnOn } = useEditorState();
  const [value, setValue] = useState('');
  const [selection, setSelection] = useState<Range>();
  const [anchorPosition, setAnchorPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const reactEditor = useEditor();
  const editor = useSlate() as EditorWithLinkPlugin;
  const open = toggle('link-popover');

  useEffect(() => {
    editor.openLinkPopover = (): void => turnOn('link-popover');
  }, []);

  const close = useCallback(() => {
    turnOff('link-popover');
  }, []);

  useEffect(() => {
    const { selection } = editor;
    if (!open || !selection) {
      return;
    }

    setSelection(selection);
    const links = getNodeLinks(
      editor,
      selection.anchor.path,
      selection.focus.path,
    );

    if (links.length) {
      setValue(links[0][0].url as string);
    } else {
      setValue('');
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection)
    ) {
      close();
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection) {
      return;
    }

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    setAnchorPosition({
      top: rect.bottom + window.pageYOffset,
      left: rect.left + window.pageXOffset + rect.width / 2,
    });
  }, [editor.selection, open]);

  const insertLink = useCallback(() => {
    if (!value) {
      return;
    }

    // Don't allow scripts
    if (value.substr(0, 11) === 'javascript:') {
      return;
    }

    let url = value;

    if (!isUrl(value) && value.substr(0, 7) !== 'mailto:') {
      url = `http://${url}`;
    }

    Transforms.wrapNodes(
      editor,
      {
        type: 'link',
        url,
        children: [],
      },
      { at: selection, split: true },
    );
    close();
  }, [selection, value]);

  const removeLink = useCallback(() => {
    if (!selection) {
      return;
    }

    // Node normalizer will remove links without a URL
    // so we don't need to worry about removing the nodes
    Transforms.unsetNodes(editor, 'url', {
      match: (n) => n.type === 'link',
      split: true,
      at: selection,
    });

    close();
  }, [selection, value]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      insertLink();
    },
    [insertLink],
  );

  return (
    <Popover
      open={open}
      anchorReference="anchorPosition"
      onClose={close}
      anchorPosition={anchorPosition}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          width: 480,
          padding: '11px 12px',
          display: 'flex',
          maxWidth: 'calc(100vw - 24px)',
          alignItems: 'center',
        }}
      >
        <form style={{ marginRight: 8, width: '100%' }} onSubmit={handleSubmit}>
          <TextField
            autoFocus
            placeholder="Paste your link, such as http://wikipedia.org..."
            style={{ marginRight: 8, width: '100%' }}
            value={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
              setValue(event.target.value)
            }
          />
        </form>
        <Button style={{ border: 'none', minWidth: 0 }} onClick={insertLink}>
          Link
        </Button>
        <Button style={{ border: 'none', minWidth: 0 }} onClick={removeLink}>
          Unlink
        </Button>
      </div>
    </Popover>
  );
};
