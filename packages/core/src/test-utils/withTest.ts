import { withPlugins, BraindropEditorPluginFactory } from '../withPlugins';
import { BraindropEditor } from '../types';

export const withTest = (
  basicEditor: BraindropEditor,
  plugins: BraindropEditorPluginFactory[] = [],
): BraindropEditor => {
  const editor = withPlugins(basicEditor, plugins);
  const { isInline, isVoid } = editor;

  editor.isInline = (element): boolean => {
    return isInline(element);
  };

  editor.isVoid = (element): boolean => {
    return isVoid(element);
  };

  return editor;
};
