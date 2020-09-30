import React from 'react';
import { PopoverProps } from '../../UIProvider';

export const Popover: React.FC<PopoverProps> = ({ children, ...other }) => (
  <div {...other}>{children}</div>
);
