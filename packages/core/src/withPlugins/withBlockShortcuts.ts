import { SlashEditor, SlashPluginElementDescriptor } from './withPlugins';
import { Range, Transforms, Editor, Element } from 'slate';
import { getBlockAbove } from '../queries';

export interface BlockShortcut {
  trigger: string;
  type: string;
  turnInto?: SlashPluginElementDescriptor['turnInto'];
}

export interface BlockShortcutMap {
  [key: string]: Pick<BlockShortcut, 'type' | 'turnInto'>;
}

const withBlockShortcuts = (
  editor: SlashEditor,
  shortcuts: BlockShortcut[],
): SlashEditor => {
  const { insertText } = editor;
  const triggers = shortcuts.reduce((current, shortcut) => {
    const trigger = shortcut.trigger.substr(-1);
    if (!current.includes(trigger)) {
      return [...current, trigger];
    }

    return current;
  }, [] as string[]);
  const shortcutMap = shortcuts.reduce((map, shortcut) => {
    const key = shortcut.trigger.substring(0, shortcut.trigger.length - 1);
    return {
      ...map,
      [key]: {
        type: shortcut.type,
        turnInto: shortcut.turnInto,
      },
    };
  }, {} as BlockShortcutMap);

  editor.insertText = (text): void => {
    const { selection } = editor;
    if (triggers.includes(text) && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });

      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);
      const shortcut = shortcutMap[beforeText];
      const type = block ? block[0].type : 'text';

      if (shortcut && type !== shortcut.type) {
        Transforms.select(editor, range);
        Transforms.delete(editor);

        if (shortcut.turnInto && block) {
          shortcut.turnInto(editor, block[0] as Element);
        } else {
          Transforms.setNodes(
            editor,
            { type: shortcut.type },
            { match: (n) => Editor.isBlock(editor, n) },
          );
        }

        return;
      }
    }

    insertText(text);
  };

  return editor;
};

export default withBlockShortcuts;
