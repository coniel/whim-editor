import React, { useRef } from 'react';
import TextareaAutosize from 'react-autosize-textarea';

export type EquationTextareaProps = React.HTMLAttributes<HTMLTextAreaElement>;

const EquationTextarea: React.FC<EquationTextareaProps> = (props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleFocus(): void {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select();
      }
    });
  }

  return (
    <TextareaAutosize
      autoFocus
      onFocus={handleFocus}
      spellCheck={false}
      data-gramm_editor="false"
      style={{
        border: 0,
        backgroundColor: 'transparent',
        outline: 'none',
        fontSize: '14px',
        wordBreak: 'break-word',
        fontFamily: 'iawriter-mono, Nitti, Menlo, Courier, monospace',
        whiteSpace: 'pre-wrap',
        lineHeight: '22px',
        overflow: 'auto',
        maxHeight: '50vh',
        paddingTop: 3,
        paddingBottom: 3,
        width: '100%',
        resize: 'none',
      }}
      {...props}
      ref={inputRef}
    />
  );
};

export default EquationTextarea;
