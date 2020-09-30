import React, { useMemo } from 'react';
import { Slate, withReact } from 'slate-react';
import { createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';
import withPlugins from '../withPlugins';
import { SlashPluginFactory } from '../withPlugins/withPlugins';
import UIProvider, { UIComponents } from '../UIProvider';
import { EditableProps } from 'slate-react/dist/components/editable';
import { EditorStateProvider } from '../EditorStateProvider';

export interface EditorProps {
  placeholder?: string;
  onChange: (value: Node[]) => void;
  value: Node[];
  plugins?: SlashPluginFactory[];
  components: UIComponents;
  autoFocus?: boolean;
  spellCheck?: boolean;
}

const Editor: React.FC<EditorProps> = ({
  children,
  placeholder,
  value,
  onChange,
  plugins = [],
  components,
  spellCheck = true,
  autoFocus = true,
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
        placeholder,
        spellCheck,
        autoFocus,
      } as EditableProps),
    [editor],
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <EditorStateProvider>
        <UIProvider components={components}>
          {children}
          {editable}
        </UIProvider>
      </EditorStateProvider>
    </Slate>
  );
};

export default Editor;
