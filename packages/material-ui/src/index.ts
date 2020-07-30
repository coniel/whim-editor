import { UIComponents } from '@slash/editor';
import InlinePlaceholder from './InlinePlaceholder';
import BlockPlaceholder from './BlockPlaceholder';
import VoidBlock from './VoidBlock';
import Button from './Button';
import Popover from './Popover';

export { default as Popover } from './Popover';
export * from './Popover';

export { default as InlinePlaceholder } from './InlinePlaceholder';
export * from './InlinePlaceholder';

export { default as BlockPlaceholder } from './BlockPlaceholder';
export * from './BlockPlaceholder';

export { default as VoidBlock } from './VoidBlock';
export * from './VoidBlock';

export { default as Button } from './Button';
export * from './Button';

const components: UIComponents = {
  InlinePlaceholder,
  BlockPlaceholder,
  VoidBlock,
  Button,
  Popover,
};

export default components;
