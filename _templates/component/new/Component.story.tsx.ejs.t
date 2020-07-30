---
to: packages/<%= package %>/src/<%= name %>/<%= name %>.story.tsx
---
import React from 'react';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import <%= name %> from './<%= name %>';

export default {
  title: '<%= package %>|<%= name %>',
  component: <%= name %>,
};

export const Default: React.FC = () => {
  return (
    <<%= name %> onClick={action('onClick')}>
      {text('placeholder', 'Type some text')}
    </<%= name %>>
  );
};
