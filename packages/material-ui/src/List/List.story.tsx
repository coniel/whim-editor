import React from 'react';
import List from './List';
import MenuItem from '../MenuItem';

export default {
  title: 'material-ui|List',
  component: List,
};

export const Default: React.FC = () => {
  return (
    <List>
      <MenuItem>Javascript</MenuItem>
      <MenuItem>HTML</MenuItem>
      <MenuItem>CSS</MenuItem>
    </List>
  );
};
