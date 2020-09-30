import React from 'react';

export interface MenuItem {
  id: string;
  group?: string;
  title: string;
  subtitle?: string;
  shortcut?: string;
  shortcutTooltip?: string;
  tooltip?: string;
  tooltipImage?: string;
  keywords?: string;
  index: number;
  inline?: boolean;
  image?: string;
  imageSize?: 'large' | 'small';
  icon?: React.ReactNode;
}
