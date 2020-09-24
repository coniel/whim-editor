import React from 'react';
import { action } from '@storybook/addon-actions';
import MenuItem from './MenuItem';

export default {
  title: 'material-ui|MenuItem',
  component: MenuItem,
};

export const Default: React.FC = () => {
  return <MenuItem onClick={action('onClick')}>Menu item</MenuItem>;
};
