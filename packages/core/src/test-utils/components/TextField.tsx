import React from 'react';
import { TextFieldProps } from '../../UIProvider';

export const TextField: React.FC<TextFieldProps> = ({ ...other }) => (
  <input type="text" {...other} />
);
