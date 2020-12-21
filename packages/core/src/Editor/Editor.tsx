import React, { useMemo } from 'react';
import { Slate, withReact } from 'slate-react';
import { createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';
import { useAndroidPlugin } from 'slate-android-plugin';
import withPlugins from '../withPlugins';
import { SlashPluginFactory } from '../withPlugins/withPlugins';
import UIProvider, { UIComponents } from '../UIProvider';
import { EditableProps } from 'slate-react/dist/components/editable';
import { EditorStateProvider } from '../EditorStateProvider';

export interface EditorProps {
  className?: string;
  placeholder?: string;
  onChange: (value: Node[]) => void;
  value: Node[];
  plugins?: SlashPluginFactory[];
  components: UIComponents;
  autoFocus?: boolean;
  spellCheck?: boolean;
  readOnly?: boolean;
}

const Editor: React.FC<EditorProps> = ({
  children,
  className,
  placeholder,
  value,
  onChange,
  plugins = [],
  components,
  spellCheck = true,
  autoFocus = true,
  readOnly = false,
}) => {
  const editor = useAndroidPlugin(
    useMemo(
      () => withPlugins(withHistory(withReact(createEditor())), plugins),
      [],
    ),
  );
  const editable = useMemo(
    () =>
      editor.renderEditable({
        className,
        placeholder,
        spellCheck,
        readOnly,
        autoFocus,
        renderElement: editor.renderElement,
        onKeyDown: editor.onKeyDown,
        renderLeaf: editor.renderLeaf,
        decorate: editor.decorate,
        onDOMBeforeInput: editor.onDOMBeforeInput,
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
