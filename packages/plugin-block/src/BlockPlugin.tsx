import React from 'react';
import { SlashPluginFactory, SlashPlugin, SlashEditor } from '@slash/editor';
import BlockPluginProvider from './BlockPluginProvider';
import BlockPluginUI from './BlockPluginUI';
import ElementBlock from './ElementBlock';

const BlockPlugin = (): SlashPluginFactory => (
  editor: SlashEditor,
): SlashPlugin => {
  const { renderEditable, renderElement } = editor;

  editor.renderEditable = (props): JSX.Element => {
    return (
      <BlockPluginProvider>
        {renderEditable(props)}
        <BlockPluginUI />
      </BlockPluginProvider>
    );
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
