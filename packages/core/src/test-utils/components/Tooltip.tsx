import React from 'react';
import { TooltipProps } from '../../UIProvider';

export const Tooltip: React.FC<TooltipProps> = ({ children }) => (
  <div>{children}</div>
);
