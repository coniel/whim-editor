import React from 'react';
import { BlockPlaceholderProps } from '../../UIProvider';

export const BlockPlaceholder: React.FC<BlockPlaceholderProps> = ({
  children,
  ...other
}) => <div {...other}>{children}</div>;
