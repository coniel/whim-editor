---
to: packages/<%= package %>/src/<%= name %>Plugin.story.tsx
---
import React, { useState } from 'react';
import { Node } from 'slate';
import components from '@braindrop-editor/material-ui';
import { Editor } from '@braindrop-editor/core';
import <%= name %>Plugin from './<%= name %>Plugin';

export default { title: 'Plugins|<%= name %>' };

const <%= name %> = <%= name %>Plugin();
const Custom<%= name %> = <%= name %>Plugin({});

export const With<%= name %>Plugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'text',
      children: [{ text: 'I use the <%= name %>Plugin.' }],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[<%= name %>]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};

export const WithCustomised<%= name %>Plugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'text',
      children: [{ text: 'I use the <%= name %>Plugin with custom options.' }],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[Custom<%= name %>]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
