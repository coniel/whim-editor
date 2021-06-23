import React, { Fragment, useState, useEffect, FormEvent, useRef } from 'react';
import {
  useSlateStatic,
  useFocused,
  useSelected,
  ReactEditor,
} from 'slate-react';
import { Transforms } from 'slate';
import {
  useUI,
  useHardReturn,
  RenderElementProps,
} from '@braindrop-editor/core';
import { EquationTextarea } from '../EquationTextarea';
import { useTex } from '../utils/useTex';
import { EquationIcon, EnterIcon } from '../icons';
import { EquationError } from '../EquationError';
import { InlineEquationElement } from '../EquationPlugin.types';

export interface ElementEquationInlineProps extends RenderElementProps {
  element: InlineEquationElement;
}

export const ElementEquationInline: React.FC<ElementEquationInlineProps> = ({
  attributes,
  children,
  element,
}) => {
  const { Popover, InlinePlaceholder, Button } = useUI();
  const [open, setOpen] = useState(!element.properties.expression);
  const { html, error, onChange, value } = useTex(
    element.properties.expression as string,
  );
  const spanRef = useRef<HTMLSpanElement>(null);
  const focused = useFocused();
  const selected = useSelected();
  const [rect, setRect] = useState({ bottom: 0, left: 0 });
  const editor = useSlateStatic();
  const [selection, setSelection] = useState(editor.selection);

  const handleOpen = (): void => {
    const native = window.getSelection() as Selection;
    const range = native.getRangeAt(0);
    setRect(range.getBoundingClientRect());
    setSelection(editor.selection);
    setOpen(true);
  };

  useEffect(() => {
    if (
      focused &&
      selected &&
      editor.selection &&
      JSON.stringify(editor.selection.anchor.path) ===
        JSON.stringify(editor.selection.focus.path)
    ) {
      handleOpen();
    }
  }, [focused, selected, selection]);

  useEffect(() => {
    Transforms.setNodes(
      editor,
      {
        tex: value,
      } as Partial<InlineEquationElement>,
      { at: ReactEditor.findPath(editor, element) },
    );
  }, [value]);

  const handleClose = (): void => {
    setOpen(false);
    if (selection) {
      editor.selection = selection;

      if (value.length) {
        Transforms.move(editor, { distance: 1, unit: 'character' });
      } else {
        Transforms.move(editor, { distance: 1, unit: 'character' });
        editor.deleteBackward('character');
      }
    }

    ReactEditor.focus(editor);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ): void => {
    const { key } = event;
    if (key === 'Enter') {
      useHardReturn(handleClose)(event);
    } else if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
      const { selectionEnd, selectionStart } = target;

      if (selectionEnd === selectionStart) {
        if (selectionStart === 0 && key === 'ArrowLeft') {
          event.preventDefault();
          setOpen(false);
          editor.selection = selection;
          Transforms.move(editor, {
            distance: 1,
            unit: 'character',
            reverse: true,
          });
          ReactEditor.focus(editor);
        } else if (selectionEnd === value.length && key === 'ArrowRight') {
          event.preventDefault();
          setOpen(false);
          editor.selection = selection;
          Transforms.move(editor, {
            distance: 1,
            unit: 'character',
          });
          ReactEditor.focus(editor);
        }
      }
    }
  };

  const handleFormSubmission = (event: FormEvent): void => {
    event.preventDefault();
    handleClose();
  };

  return (
    <Fragment>
      <Popover
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: rect.bottom + window.pageYOffset + 4,
          left: rect.left + window.pageXOffset,
        }}
      >
        <form
          onSubmit={handleFormSubmission}
          style={{
            display: 'flex',
            padding: '8px 10px',
            alignItems: 'center',
            width: 400,
          }}
        >
          <EquationTextarea
            defaultValue={value}
            onKeyDown={handleKeyDown}
            onChange={onChange}
            placeholder="E = mc^2"
          />
          <Button endIcon={<EnterIcon />} onClick={handleClose}>
            Done
          </Button>
        </form>
        {error && <EquationError error={error} />}
      </Popover>
      <span {...attributes}>
        <span
          role="button"
          tabIndex={0}
          onClick={handleOpen}
          style={{
            background:
              open && value.length ? 'rgba(46, 170, 220, 0.2)' : 'transparent',
            paddingLeft: 4,
            paddingRight: 4,
            marginLeft: -4,
            marginRight: -4,
            borderRadius: 3,
            height: '24px',
            display: 'inline-block',
            outline: 'none',
          }}
          ref={spanRef}
        >
          {!value && (
            <InlinePlaceholder label="New equation" icon={<EquationIcon />} />
          )}
          {value && (
            <span
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />
          )}
          {children}
        </span>
      </span>
    </Fragment>
  );
};
