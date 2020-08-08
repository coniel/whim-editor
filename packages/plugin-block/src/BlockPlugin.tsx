import React from 'react';
import { SlashPluginFactory, SlashPlugin, SlashEditor } from '@slash/editor';
import BlockPluginProvider from './BlockPluginProvider';
import BlockPluginUI from './BlockPluginUI';
import ElementBlock from './ElementBlock';
import { Transforms } from 'slate';

const BlockPlugin = (): SlashPluginFactory => (
  editor: SlashEditor,
): SlashPlugin => {
  const { renderEditable, renderElement, insertData } = editor;

  editor.renderEditable = (props): JSX.Element => {
    return (
      <BlockPluginProvider>
        {renderEditable(props)}
        <BlockPluginUI />
      </BlockPluginProvider>
    );
  };

  editor.insertData = (data): void => {
    const sheets = data.getData('text/sheets');

    if (sheets) {
      const blocks = JSON.parse(sheets);
      if (editor.selection) {
        const newPath = editor.selection.anchor.path.slice(0, -1);
        newPath[newPath.length - 1] += 1;
        Transforms.insertNodes(editor, blocks, {
          at: newPath,
        });
      }
      return;
    }

    insertData(data);
  };

  return {
    // Wraps all Elements in ElementBlock
    renderElement: (props): JSX.Element =>
      renderElement({
        ...props,
        children: (
          <ElementBlock id={props.element.id}>{props.children}</ElementBlock>
        ),
      }),
  };
};

export default BlockPlugin;
