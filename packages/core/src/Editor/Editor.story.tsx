import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Node } from 'slate';
import Editor from './Editor';
import { SlashPlugin } from '../withPlugins/withPlugins';
import components from '@sheets-editor/material-ui';

export default { title: 'Editor', component: Editor };

const initialValue = [{ type: 'text', children: [{ text: 'Hello Slash' }] }];

const plugin = (): SlashPlugin => ({
  renderElement: ({ attributes, children }): JSX.Element => (
    <div
      {...attributes}
      style={{ border: '2px solid #03A9F4', padding: 8, marginBottom: 8 }}
    >
      {children}
    </div>
  ),
});

export const Default: React.FC = () => {
  const [value, setValue] = useState<Node[]>(initialValue);

  return (
    <Editor
      components={components}
      placeholder="Placeholder text"
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
      components={components}
      placeholder="Type some text"
      value={value}
      plugins={[plugin]}
      onChange={(newValue): void => {
        setValue(newValue);
        action('onChange')(value);
      }}
    />
  );
};
