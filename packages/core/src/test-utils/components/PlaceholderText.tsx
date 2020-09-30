import React from 'react';
import { PlaceholderTextProps } from '../../UIProvider';

export const PlaceholderText: React.FC<PlaceholderTextProps> = ({
  children,
  ...other
}) => <span {...other}>{children}</span>;
