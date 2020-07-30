import React from 'react';
import { text } from '@storybook/addon-knobs';
import VoidBlock from './VoidBlock';
import { action } from '@storybook/addon-actions';

export default {
  title: 'ui|VoidBlock',
  component: VoidBlock,
};

export const Default: React.FC = () => {
  return (
    <VoidBlock onClick={action('onClick')}>
      {text('content', 'Content')}
    </VoidBlock>
  );
};
