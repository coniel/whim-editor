import React from 'react';
import { useSlate } from 'slate-react';
import { Editor, Range } from 'slate';
import { HoveringToolbar as HoveringToolbarPlugin } from '@sheets-editor/plugin-hovering-toolbar';
import { HoveringToolbarButton as Button } from '../HoveringToolbarButton';
import { useUI } from '@sheets-editor/core';
import { EditorWithPlugins } from '../Editor.types';

const isBlockActive = (editor: EditorWithPlugins, format: string): boolean => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });

  return !!match;
};

export const HoveringToolbar: React.FC = () => {
  const editor = useSlate() as EditorWithPlugins;
  const { Tooltip } = useUI();

  return (
    <HoveringToolbarPlugin>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'stretch',
          height: 32,
          background: 'white',
          overflow: 'hidden',
          fontSize: 14,
          lineHeight: 1.2,
          borderRadius: 3,
          boxShadow:
            'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px',
        }}
      >
        <Tooltip title="Bold" shortcut="ctrl+B">
          <Button
            active={editor.isRichTextFormatActive('bold')}
            onMouseDown={(event): void => {
              event.preventDefault();
              editor.toggleRichTextFormat('bold');
            }}
          >
            B
          </Button>
        </Tooltip>
        <Tooltip title="Italic" shortcut="ctrl+I">
          <Button
            active={editor.isRichTextFormatActive('italic')}
            onMouseDown={(event): void => {
              event.preventDefault();
              editor.toggleRichTextFormat('italic');
            }}
          >
            <span style={{ fontStyle: 'italic' }}>i</span>
          </Button>
        </Tooltip>
        <Tooltip title="Underline" shortcut="ctrl+U">
          <Button
            active={editor.isRichTextFormatActive('underline')}
            onMouseDown={(event): void => {
              event.preventDefault();
              editor.toggleRichTextFormat('underline');
            }}
          >
            <span style={{ textDecoration: 'underline' }}>U</span>
          </Button>
        </Tooltip>
        <Tooltip title="Strike-through" shortcut="ctrl+Shift-S">
          <Button
            active={editor.isRichTextFormatActive('strike-through')}
            onMouseDown={(event): void => {
              event.preventDefault();
              editor.toggleRichTextFormat('strike-through');
            }}
          >
            <span style={{ textDecoration: 'line-through' }}>S</span>
          </Button>
        </Tooltip>
        <Tooltip title="Create link" shortcut="ctrl+K">
          <Button
            active={isBlockActive(editor, 'link')}
            onMouseDown={(event): void => {
              event.preventDefault();
              editor.openLinkPopover();
            }}
          >
            <svg
              viewBox="0 0 30 30"
              className="link"
              style={{
                width: 17,
                height: 17,
                display: 'block',
                fill: 'inherit',
                flexShrink: 0,
                backfaceVisibility: 'hidden',
              }}
            >
              <path d="M2,12c0-3.309,2.691-6,6-6h8c3.309,0,6,2.691,6,6s-2.691,6-6,6h-6c0,0.736,0.223,1.41,0.574,2H16c4.418,0,8-3.582,8-8 c0-4.418-3.582-8-8-8H8c-4.418,0-8,3.582-8,8c0,2.98,1.634,5.575,4.051,6.951C4.021,18.638,4,18.321,4,18 c0-0.488,0.046-0.967,0.115-1.436C2.823,15.462,2,13.827,2,12z M25.953,11.051C25.984,11.363,26,11.68,26,12 c0,0.489-0.047,0.965-0.117,1.434C27.176,14.536,28,16.172,28,18c0,3.309-2.691,6-6,6h-8c-3.309,0-6-2.691-6-6s2.691-6,6-6h6 c0-0.731-0.199-1.413-0.545-2H14c-4.418,0-8,3.582-8,8c0,4.418,3.582,8,8,8h8c4.418,0,8-3.582,8-8 C30,15.021,28.368,12.428,25.953,11.051z"></path>
            </svg>
          </Button>
        </Tooltip>
        <Tooltip title="Mark as code" shortcut="ctrl+E">
          <Button>
            <svg
              viewBox="0 0 30 30"
              className="code"
              style={{
                width: 15,
                height: 15,
                display: 'block',
                fill: 'inherit',
                flexShrink: 0,
                backfaceVisibility: 'hidden',
              }}
            >
              <path d="M11.625,4L0,15l11.625,11L13,24.563L2.906,15L13,5.438L11.625,4z M18.375,4L17,5.438L27.094,15L17,24.563L18.375,26L30,15L18.375,4z"></path>
            </svg>
          </Button>
        </Tooltip>
        <Tooltip title="Create equation" shortcut="ctrl+Shift+E">
          <Button>
            <svg
              viewBox="0 0 30 30"
              className="equation"
              style={{
                width: 16,
                height: 16,
                display: 'block',
                fill: 'inherit',
                flexShrink: 0,
                backfaceVisibility: 'hidden',
              }}
            >
              <path d="M6.04883 27.3232C7.24219 27.3232 7.86426 26.4854 8.20703 25.3936L13.9834 6.79492H27.5039C28.2275 6.79492 28.7227 6.35059 28.7227 5.65234C28.7227 4.97949 28.2275 4.53516 27.5039 4.53516H13.958C12.6631 4.53516 12.0791 5.01758 11.7363 6.13477L6.18848 24.3525H5.97266L3.58594 15.9355C3.38281 15.2373 3.00195 14.9072 2.40527 14.9072C1.73242 14.9072 1.2373 15.3896 1.2373 16.0117C1.2373 16.2656 1.30078 16.4941 1.35156 16.6846L4.04297 25.5332C4.36035 26.5615 4.93164 27.3232 6.04883 27.3232ZM16.3955 24.7334C16.8652 24.7334 17.1064 24.5684 17.4619 24.0732L20.4707 19.8203H20.5215L23.5049 24.0732C23.873 24.5684 24.1143 24.7334 24.5713 24.7334C25.2061 24.7334 25.6758 24.3018 25.6758 23.7051C25.6758 23.4258 25.6123 23.1973 25.4219 22.9561L21.9307 18.208L25.4473 13.4346C25.6377 13.168 25.7139 12.9395 25.7139 12.6855C25.7139 12.127 25.2568 11.6953 24.6475 11.6953C24.2031 11.6953 23.9365 11.8477 23.6064 12.3174L20.7246 16.5957H20.6611L17.6904 12.3047C17.373 11.8477 17.0938 11.6953 16.624 11.6953C16.0146 11.6953 15.5068 12.165 15.5068 12.7363C15.5068 13.0537 15.583 13.2568 15.8115 13.5488L19.1504 18.1445L15.6084 23.0322C15.418 23.2861 15.3672 23.4639 15.3672 23.7559C15.3672 24.3018 15.8115 24.7334 16.3955 24.7334Z"></path>
            </svg>
          </Button>
        </Tooltip>
      </div>
    </HoveringToolbarPlugin>
  );
};
