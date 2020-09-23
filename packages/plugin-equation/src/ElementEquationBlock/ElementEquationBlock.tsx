import React, { useState, useRef, useEffect } from 'react';
import { useEditor, ReactEditor, useSelected } from 'slate-react';
import { Transforms, Range } from 'slate';
import {
  useUI,
  useHardReturn,
  RenderElementProps,
  SlashEditor,
} from '@sheets-editor/core';
import EquationError from '../EquationError';
import useTex from '../utils/useTex';
import { EnterIcon, TexIcon } from '../icons';
import EquationTextarea from '../EquationTextarea';

export interface ElementEquationBlockProps extends RenderElementProps {
  foo?: string;
}

const ElementEquationBlock: React.FC<ElementEquationBlockProps> = ({
  attributes,
  children,
  element,
}) => {
  const { BlockPlaceholder, VoidBlock, Button, Popover } = useUI();
  const selected = useSelected();
  const [open, setOpen] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const { html, error, onChange, value } = useTex(element.tex as string, {
    displayMode: true,
  });
  const editor = useEditor() as SlashEditor;

  useEffect(() => {
    if (
      !element.tex &&
      editor.selection &&
      selected &&
      Range.isCollapsed(editor.selection)
    ) {
      setOpen(true);
    }
  }, [selected, editor.selection, element.tex]);

  useEffect(() => {
    Transforms.setNodes(
      editor,
      {
        tex: value,
      },
      { at: ReactEditor.findPath(editor, element) },
    );
  }, [value]);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleFormSubmission = (event: React.FormEvent): void => {
    event.preventDefault();
    handleClose();
  };

  const handleDelete = (event: React.MouseEvent): void => {
    event.preventDefault();
    console.log('called 2');

    editor.deleteElement(element);
  };

  return (
    <div {...attributes}>
      <div ref={divRef}>
        {children}
        {!value && (
          <BlockPlaceholder
            label="Add a TeX equation"
            icon={<TexIcon />}
            onClick={handleOpen}
            onClickDelete={handleDelete}
          />
        )}
        {value && (
          <VoidBlock
            onClick={handleOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 8px',
              boxSizing: 'border-box',
            }}
          >
            <span
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />
          </VoidBlock>
        )}
        <Popover open={open} anchorEl={divRef.current} onClose={handleClose}>
          <form
            onSubmit={handleFormSubmission}
            style={{ padding: '8px 10px', width: 380 }}
          >
            <EquationTextarea
              defaultValue={value}
              onKeyDown={useHardReturn(handleClose)}
              onChange={onChange}
              placeholder="\begin{aligned}                                          &nbsp;y &= 2x+x+4-2 \\                                      &nbsp;&= 3x+2                                       \end{aligned}"
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: '#B6B5B3',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                Shift +
                <span style={{ marginRight: 4, marginLeft: -2 }}>
                  <EnterIcon size={12} />
                </span>{' '}
                for new line
              </div>
              <Button
                onClick={handleClose}
                type="submit"
                endIcon={<EnterIcon />}
              >
                Done
              </Button>
            </div>
          </form>
          {error && <EquationError error={error} />}
        </Popover>
      </div>
    </div>
  );
};

export default ElementEquationBlock;
