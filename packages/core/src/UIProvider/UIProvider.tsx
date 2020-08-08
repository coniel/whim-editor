import React from 'react';
import { createContext } from '../utils';

export interface BlockPlaceholderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}
export type BlockPlaceholder = React.FC<BlockPlaceholderProps>;

export interface InlinePlaceholderProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  label: React.ReactNode;
  icon?: React.ReactNode;
}
export type InlinePlaceholder = React.FC<InlinePlaceholderProps>;

export interface VoidBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: (event: React.MouseEvent) => void;
}
export type VoidBlock = React.FC<VoidBlockProps>;

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: 'submit' | 'button';
}
export type Button = React.FC<ButtonProps>;

export interface PopoverAnchorPosition {
  top: number;
  left: number;
}
export interface PopoverProps {
  anchorReference?: 'anchorPosition' | 'anchorEl';
  onClose: () => void;
  open: boolean;
  anchorEl?: HTMLElement | null;
  anchorPosition?: PopoverAnchorPosition;
}
export type Popover = React.FC<PopoverProps>;

export interface UIComponents {
  Button: Button;
  BlockPlaceholder: BlockPlaceholder;
  InlinePlaceholder: InlinePlaceholder;
  VoidBlock: VoidBlock;
  Popover: Popover;
}

export interface UIProviderProps {
  components: UIComponents;
}

export type UIContextValue = UIComponents;

const [hook, Provider] = createContext<UIContextValue>();

const UIProvider: React.FC<UIProviderProps> = ({ children, components }) => {
  return <Provider value={{ ...components }}>{children}</Provider>;
};

export const useUI = hook;
export default UIProvider;
