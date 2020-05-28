import { SlashEditor, withPlugins, SlashPluginFactory } from '@slash/editor';

const withTest = (
  basicEditor: SlashEditor,
  plugins: SlashPluginFactory[] = [],
): SlashEditor => {
  const editor = withPlugins(basicEditor, plugins);
  const { isInline, isVoid } = editor;

  editor.isInline = (element): boolean => {
    return element.inline === true ? true : isInline(element);
  };

  editor.isVoid = (element): boolean => {
    return element.void === true ? true : isVoid(element);
  };

  return editor;
};

export default withTest;
