import React from 'react';
import { MenuItemProps } from '../../UIProvider';

export const MenuItem: React.FC<MenuItemProps> = ({ children, ...other }) => (
  <li {...other}>{children}</li>
);
