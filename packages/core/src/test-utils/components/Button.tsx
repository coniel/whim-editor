import React from 'react';
import { ButtonProps } from '../../UIProvider';

export const Button: React.FC<ButtonProps> = ({ children, ...other }) => (
  <button {...other}>{children}</button>
);
