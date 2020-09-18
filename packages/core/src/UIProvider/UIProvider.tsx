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

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: 'submit' | 'button';
}
export type Button =
  | React.FC<ButtonProps>
  | React.ForwardRefExoticComponent<
      ButtonProps & React.RefAttributes<HTMLButtonElement>
    >;

export interface PopoverAnchorPosition {
  top: number;
  left: number;
}

export interface PopoverAnchorOrigin {
  vertical?: string;
  horizontal?: string;
}

export interface PopoverTransformOrigin {
  vertical?: string;
  horizontal?: string;
}

export interface PopoverProps {
  anchorReference?: 'anchorPosition' | 'anchorEl';
  onClose: () => void;
  open: boolean;
  disableBackdrop?: boolean;
  anchorEl?: HTMLElement | null;
  anchorPosition?: PopoverAnchorPosition;
  anchorOrigin?: PopoverAnchorOrigin;
  transformOrigin?: PopoverTransformOrigin;
}
export type Popover = React.FC<PopoverProps>;

export type ListProps = React.HTMLAttributes<HTMLUListElement>;
export type List = React.FC<ListProps>;

export type MenuItemProps = React.HTMLAttributes<HTMLLIElement>;
export type MenuItem = React.FC<MenuItemProps>;

export type TextFieldProps = React.HTMLProps<HTMLInputElement>;
export type TextField = React.FC<TextFieldProps>;

export interface UIComponents {
  Button: Button;
  BlockPlaceholder: BlockPlaceholder;
  InlinePlaceholder: InlinePlaceholder;
  VoidBlock: VoidBlock;
  Popover: Popover;
  List: List;
  MenuItem: MenuItem;
  TextField: TextField;
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
