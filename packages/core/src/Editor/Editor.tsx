import React, { useMemo } from 'react';
import { Slate, withReact } from 'slate-react';
import { createEditor, Descendant, Range } from 'slate';
import { withHistory } from 'slate-history';
import { withPlugins } from '../withPlugins';
import { BraindropEditorPluginFactory } from '../withPlugins/withPlugins';
import { UIProvider, UIComponents } from '../UIProvider';
import { EditorStateProvider } from '../EditorStateProvider';

export interface EditorProps {
  className?: string;
  placeholder?: string;
  onChange: (value: Descendant[]) => void;
  onSelectionChange?: (selection: Range | null) => void;
  value: Descendant[];
  plugins?: BraindropEditorPluginFactory<any>[];
  components: UIComponents;
  autoFocus?: boolean;
  spellCheck?: boolean;
  readOnly?: boolean;
  blockIdGenerator?: () => string;
}

export const Editor: React.FC<EditorProps> = ({
  children,
  className,
  placeholder,
  value,
  onChange,
  onSelectionChange,
  blockIdGenerator,
  plugins = [],
  components,
  spellCheck = true,
  autoFocus = true,
  readOnly = false,
}) => {
  const editor = useMemo(
    () =>
      withPlugins(
        withHistory(withReact(createEditor())),
        plugins,
        blockIdGenerator,
      ),
    [],
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
      }),
    [editor],
  );

  function handleChange(nextValue: Descendant[]) {
    onChange(nextValue);

    if (onSelectionChange) {
      onSelectionChange(editor.selection);
    }
  }

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <EditorStateProvider>
        <UIProvider components={components}>
          {children}
          {editable}
        </UIProvider>
      </EditorStateProvider>
    </Slate>
  );
};
