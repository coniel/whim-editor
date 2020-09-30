import React from 'react';
import { ListProps } from '../../UIProvider';

export const List: React.FC<ListProps> = ({ children, ...other }) => (
  <ul {...other}>{children}</ul>
);
