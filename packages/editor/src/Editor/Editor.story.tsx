import React, { useState } from 'react';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { Node } from 'slate';
import Editor from './Editor';
import { SlashEditor } from '../withPlugins/withPlugins';

export default { title: 'Editor', component: Editor };

const initialValue = [{ type: 'text', children: [{ text: 'Hello Slash' }] }];

const plugin = (editor: SlashEditor): SlashEditor => {
  // eslint-disable-next-line react/display-name
  editor.renderElement = ({ attributes, children }): JSX.Element => (
    <div
      {...attributes}
      style={{ border: '2px solid #03A9F4', padding: 8, marginBottom: 8 }}
    >
      {children}
    </div>
  );

  return editor;
};

export const Default: React.FC = () => {
  const [value, setValue] = useState<Node[]>(initialValue);

  return (
    <Editor
      placeholder={text('placeholder', 'Type some text')}
      value={value}
      onChange={(newValue): void => {
        setValue(newValue);
        action('onChange')(value);
      }}
    />
  );
};

export const WithPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'text',
      children: [
        {
          text: 'I have a plugin which renders a fancy border around elements.',
        },
      ],
    },
  ]);

  return (
    <Editor
      placeholder={text('placeholder', 'Type some text')}
      value={value}
      plugins={[plugin]}
      onChange={(newValue): void => {
        setValue(newValue);
        action('onChange')(value);
      }}
    />
  );
};
