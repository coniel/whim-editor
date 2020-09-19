import React from 'react';
import { action } from '@storybook/addon-actions';
import { HoveringToolbarButton } from './HoveringToolbarButton';

export default {
  title: 'editor|HoveringToolbarButton',
  component: HoveringToolbarButton,
};

export const Default: React.FC = () => {
  return (
    <HoveringToolbarButton onClick={action('onClick')}>B</HoveringToolbarButton>
  );
};
