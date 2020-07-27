import { SlashEditorWithRichText } from './RichTextPlugin';

function onDOMBeforeInputRichText(
  editor: SlashEditorWithRichText,
  event: Event,
): void {
  switch ((event as InputEvent).inputType) {
    case 'formatBold':
      return editor.toggleRichTextFormat('bold');
    case 'formatItalic':
      return editor.toggleRichTextFormat('italic');
    case 'formatUnderline':
      return editor.toggleRichTextFormat('underline');
  }
}

export default onDOMBeforeInputRichText;
