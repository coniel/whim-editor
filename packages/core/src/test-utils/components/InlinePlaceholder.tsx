import React from 'react';
import { InlinePlaceholderProps } from '../../UIProvider';

export const InlinePlaceholder: React.FC<InlinePlaceholderProps> = ({
  children,
  ...other
}) => <span {...other}>{children}</span>;
