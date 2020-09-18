import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import MuiPopover from '@material-ui/core/Popover';

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
  disableBackdrop?: boolean;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
    paper: {
      borderRadius: 3,
      boxShadow:
        'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px',
    },
  }),
);

const Popover: React.FC<PopoverProps> = ({
  children,
  disableBackdrop,
  ...other
}) => {
  const classes = useStyles();

  return (
    <MuiPopover
      disableAutoFocus
      disableEnforceFocus
      style={disableBackdrop ? { pointerEvents: 'none' } : {}}
      anchorReference="anchorEl"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      classes={classes}
      {...other}
    >
      <div style={disableBackdrop ? { pointerEvents: 'all' } : {}}>
        {children}
      </div>
    </MuiPopover>
  );
};

export default Popover;
