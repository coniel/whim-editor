import React from 'react';
import VoidBlock from './VoidBlock';
import { action } from '@storybook/addon-actions';

export default {
  title: 'UI/VoidBlock',
  component: VoidBlock,
};

export const Default: React.FC = () => {
  return <VoidBlock onClick={action('onClick')}>Content</VoidBlock>;
};
