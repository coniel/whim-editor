import React from 'react';
import {
  SlashPluginFactory,
  SlashPlugin,
  SlashEditor,
} from '@sheets-editor/core';
import BlockPluginProvider from './BlockPluginProvider';
import BlockPluginUI from './BlockPluginUI';
import ElementBlock from './ElementBlock';
import { Transforms } from 'slate';

const BlockPlugin = (): SlashPluginFactory => (
  editor: SlashEditor,
): SlashPlugin => {
  const { renderEditable, insertData } = editor;

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

  const { renderElement } = editor;

  // Wraps all Elements in ElementBlock
  editor.renderElement = (props) => {
    return renderElement({
      ...props,
      children: editor.isInline(props.element) ? (
        props.children
      ) : (
        <ElementBlock id={props.element.id}>{props.children}</ElementBlock>
      ),
    });
  };

  return {};
};

export default BlockPlugin;
