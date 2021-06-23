import { Range, Transforms, Editor, Text } from 'slate';
import { MarkShortcutActions, MarkedText } from './withPlugins';
import { BraindropEditor } from '../types';

export const withMarkShortcuts = (
  editor: BraindropEditor,
  shortcuts: MarkShortcutActions,
): BraindropEditor => {
  const { insertText } = editor;

  editor.insertText = (text): void => {
    const { selection } = editor;
    const triggers = Object.keys(shortcuts);
    let matched = false;

    if (triggers.includes(text) && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);
      const markStarts = triggers.reduce((starts, trigger) => {
        const strings = [...starts];
        shortcuts[trigger].forEach((shortcut) => {
          strings.push(shortcut.start);
        });

        return strings;
      }, [] as string[]);

      shortcuts[text].forEach((shortcut) => {
        // Check if the shortcut end has length 1 and is the inserted
        // text or has length > 1 and is completed by the interted text
        if (
          (shortcut.end.length === 1 && text === shortcut.end) ||
          beforeText.substr(-(shortcut.end.length - 1)) ===
            shortcut.end.substr(-(shortcut.end.length - 1))
        ) {
          // Check the text up to this point contains the shortcut start
          if (beforeText.includes(shortcut.start)) {
            // We want to match against the closest shortcut start
            const startIndex = beforeText.lastIndexOf(shortcut.start);
            const textToMark = beforeText.substring(
              startIndex + shortcut.start.length,
              beforeText.length - shortcut.end.length + 1,
              // + 1 because insert has not happened yet
            );

            // The mark should only be applied if there
            // is text between the shortcut start and end.
            let shouldApply =
              textToMark.length > 0 && !markStarts.includes(textToMark);

            if (shouldApply) {
              // We need to ensure that we are not matching part of
              // a longer shortcut start which contains the same
              // characters (e.g. * and **).
              markStarts.forEach((start) => {
                const lengthDifference = start.length - shortcut.start.length;
                // We only care about longer shortcut starts
                if (lengthDifference > 0) {
                  // Get the substring which could be a longer match
                  const potentialOtherMatch = beforeText.substr(
                    startIndex - lengthDifference,
                    start.length,
                  );

                  // Check if the substring is the longer start, in
                  // which case this shortcut should not be applied.
                  if (potentialOtherMatch === start) {
                    shouldApply = false;
                  }
                }
              });
            }

            if (shouldApply && block) {
              const shortcutEndLeafIndex = anchor.path.slice(-1)[0];
              // We need to find which leaf the shortcut was
              // initiated in.
              let shortcutStartLeafIndex;
              let firstAffectedLeafIndex;
              // Loop through all the leaves up to and including
              // the one into which the text is being inserted.
              block[0].children.forEach((child, index) => {
                const textNode = (child as unknown) as Text;
                // Ignore leaves which are after the caret
                if (index <= shortcutEndLeafIndex) {
                  if (textNode.text.includes(shortcut.start)) {
                    // We want the closest match, so overriding an
                    // existing value is fine.
                    shortcutStartLeafIndex = index;
                    firstAffectedLeafIndex = index;

                    // If the mark is at the end of the text, the
                    // first affected leaf will be the next leaf.
                    if (textNode.text.endsWith(shortcut.end)) {
                      firstAffectedLeafIndex += 1;
                    }
                  }
                }
              });

              if (typeof shortcutStartLeafIndex !== 'undefined') {
                // Get the offset of the shortcut start within
                // the leaf's text.
                const startOffset = (block[0].children[
                  shortcutStartLeafIndex
                ] as Text).text.lastIndexOf(shortcut.start);

                // If all of the leaves within the shortcut range
                // already have the mark applied, remove the mark.
                let unset = true;

                // Loop through the leaves affected by the shortcut.
                // If any of them do not have the mark, the mark will
                // be applied.
                block[0].children
                  .slice(firstAffectedLeafIndex, shortcutEndLeafIndex + 1)
                  .forEach((child) => {
                    if (!(child as MarkedText)[shortcut.mark]) {
                      unset = false;
                    }
                  });

                const transformOptions = {
                  match: Text.isText,
                  split: true,
                  at: {
                    anchor: {
                      path: [...path, shortcutStartLeafIndex],
                      offset: startOffset,
                    },
                    focus: anchor,
                  },
                };

                if (unset) {
                  // Remove the mark
                  Transforms.unsetNodes(
                    editor,
                    shortcut.mark,
                    transformOptions,
                  );
                } else {
                  // Add the mark
                  Transforms.setNodes(
                    editor,
                    { [shortcut.mark]: true },
                    transformOptions,
                  );
                }

                // Remove the shortcut start from the text.
                Transforms.delete(editor, {
                  distance: shortcut.start.length,
                  unit: 'character',
                  at: {
                    path: [...path, shortcutStartLeafIndex],
                    offset: startOffset,
                  },
                });

                // Since we won't be inserting the typed character
                // we only need to remove the shortcut end if it's
                // length is greater than 1.
                if (shortcut.end.length > 1) {
                  Transforms.delete(editor, {
                    distance: shortcut.end.length - 1,
                    unit: 'character',
                    reverse: true,
                  });
                }

                // We don't want text typed after this to
                // have the mark.
                editor.removeMark(shortcut.mark);

                matched = true;
              }
            }
          }
        }
      });
    }

    // If a shortcut was matched,
    // don't insert the text.
    if (matched) {
      return;
    }

    insertText(text);
  };

  return editor;
};
