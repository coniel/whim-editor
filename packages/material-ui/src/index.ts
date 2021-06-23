import { UIComponents } from '@sheets-editor/core';
import { InlinePlaceholder } from './InlinePlaceholder';
import { BlockPlaceholder } from './BlockPlaceholder';
import { VoidBlock } from './VoidBlock';
import { Button } from './Button';
import { Popover } from './Popover';
import { TextField } from './TextField';
import { MenuItem } from './MenuItem';
import { List } from './List';
import { Tooltip } from './Tooltip';
import { MenuSectionHeading } from './MenuSectionHeading';
import { MenuDivider } from './MenuDivider';
import { PlaceholderText } from './PlaceholderText';

export * from './Popover';
export * from './InlinePlaceholder';
export * from './BlockPlaceholder';
export * from './VoidBlock';
export * from './Button';
export * from './List';
export * from './MenuItem';
export * from './TextField';
export * from './Tooltip';
export * from './MenuSectionHeading';
export * from './PlaceholderText';
export * from './MenuDivider';

export const components: UIComponents = {
  InlinePlaceholder,
  BlockPlaceholder,
  VoidBlock,
  Button,
  Popover,
  List,
  MenuItem,
  TextField,
  Tooltip,
  MenuSectionHeading,
  MenuDivider,
  PlaceholderText,
};
