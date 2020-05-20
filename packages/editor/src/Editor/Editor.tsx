import React, { useMemo } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';
import withPlugins from '../withPlugins';
import { SlashPluginFactory } from '../withPlugins/withPlugins';

export interface EditorProps {
  placeholder?: string;
  onChange: (value: Node[]) => void;
  value: Node[];
  plugins?: SlashPluginFactory[];
}

const Editor: React.FC<EditorProps> = ({
  children,
  placeholder,
  value,
  onChange,
  plugins = [],
}) => {
  const editor = useMemo(
    () => withPlugins(withHistory(withReact(createEditor())), plugins),
    [],
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      {children}
      <Editable
        renderElement={editor.renderElement}
        onKeyDown={editor.onKeyDown}
        renderLeaf={editor.renderLeaf}
        decorate={editor.decorate}
        placeholder={placeholder}
        spellCheck
        autoFocus
      />
    </Slate>
  );
};

export default Editor;
