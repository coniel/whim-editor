import React, { useMemo } from 'react';
import { Slate, withReact } from 'slate-react';
import { createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';
import withPlugins from '../withPlugins';
import { SlashPluginFactory, SlashEditor } from '../withPlugins/withPlugins';
import UIProvider, { UIComponents } from '../UIProvider';
import { render } from '@testing-library/react';
import { EditableProps } from 'slate-react/dist/components/editable';

export interface EditorProps {
  placeholder?: string;
  onChange: (value: Node[]) => void;
  value: Node[];
  plugins?: SlashPluginFactory[];
  components: UIComponents;
}

const Editor: React.FC<EditorProps> = ({
  children,
  placeholder,
  value,
  onChange,
  plugins = [],
  components,
}) => {
  const editor = useMemo(
    () => withPlugins(withHistory(withReact(createEditor())), plugins),
    [],
  );
  const editable = useMemo(
    () =>
      editor.renderEditable({
        renderElement: editor.renderElement,
        onKeyDown: editor.onKeyDown,
        renderLeaf: editor.renderLeaf,
        decorate: editor.decorate,
        onDOMBeforeInput: editor.onDOMBeforeInput,
        placeholder: placeholder,
        spellCheck: true,
        autoFocus: true,
      } as EditableProps),
    [editor],
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <UIProvider components={components}>
        {children}
        {editable}
      </UIProvider>
    </Slate>
  );
};

export default Editor;
