import React, { useMemo } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';
import withPlugins from '../withPlugins';
import { SlashPlugin } from '../withPlugins/withPlugins';

export interface EditorProps {
  placeholder?: string;
  onChange: (value: Node[]) => void;
  value: Node[];
  plugins?: SlashPlugin[];
}

const Editor: React.FC<EditorProps> = ({
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
