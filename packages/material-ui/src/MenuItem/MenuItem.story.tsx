import React from 'react';
import { action } from '@storybook/addon-actions';
import { Paper } from '@material-ui/core';
import {
  ContentCopyOutlined,
  DeleteOutline,
  CommentOutlined,
  SwapHorizOutlined,
} from '@material-ui/icons';
import { MenuItem } from './MenuItem';

export default {
  title: 'UI/material-ui/MenuItem',
  component: MenuItem,
};

export const Regular: React.FC = () => {
  return (
    <Paper square elevation={4} style={{ maxWidth: 320, marginTop: 40 }}>
      <MenuItem
        icon={<DeleteOutline fontSize="small" />}
        primaryText="Delete"
        onClick={action('onClick')}
        shortcut="Del"
        shortcutTooltip="Delete"
      />
      <MenuItem
        icon={<ContentCopyOutlined fontSize="small" />}
        primaryText="Duplicate"
        onClick={action('onClick')}
        shortcut="⌘+D"
        shortcutTooltip="Command+D"
      />
      <MenuItem
        hasSubmenu
        icon={<SwapHorizOutlined fontSize="small" />}
        primaryText="Turn into"
        onClick={action('onClick')}
      />
      <MenuItem
        icon={<CommentOutlined fontSize="small" />}
        primaryText="Comment"
        onClick={action('onClick')}
        shortcut="⌘+Shift+M"
        shortcutTooltip="Command+Shft+M"
      />
    </Paper>
  );
};

export const LargeImage: React.FC = () => {
  return (
    <Paper square elevation={4} style={{ maxWidth: 320, marginTop: 40 }}>
      <MenuItem
        tooltip="Just start writing plain text."
        tooltipImage={require('./tooltip-image.png')}
        image={require('./image.png')}
        primaryText="Text"
        secondaryText="Just start writing plain text."
        onClick={action('onClick')}
      />
    </Paper>
  );
};

export const SmallImage: React.FC = () => {
  return (
    <Paper square elevation={4} style={{ maxWidth: 320, marginTop: 40 }}>
      <MenuItem
        imageSize="small"
        tooltip="Just start writing plain text."
        tooltipImage={require('./tooltip-image.png')}
        image={require('./image.png')}
        primaryText="Text"
        onClick={action('onClick')}
      />
    </Paper>
  );
};
