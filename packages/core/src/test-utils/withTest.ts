import { withPlugins, SlashEditor, SlashPluginFactory } from '../withPlugins';

export const withTest = (
  basicEditor: SlashEditor,
  plugins: SlashPluginFactory[] = [],
): SlashEditor => {
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
