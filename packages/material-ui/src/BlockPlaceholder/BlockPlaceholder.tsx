import React from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

const userStyles = makeStyles(() =>
  createStyles({
    root: {
      margin: '6px 0',
      transition: 'background 50ms ease-in 0s',
      userSelect: 'none',
      outline: 'none',
      display: 'flex',
      alignItems: 'center',
      padding: '12px 12px 12px 12px',
      color: 'rgba(55, 53, 47, 0.6)',
      backgroundColor: 'rgb(247, 246, 243)',
      fontSize: '14px',
      borderRadius: 3,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#EDECE9',
      },
    },
    icon: {
      display: 'inline-flex',
      alignItems: 'center',
      fill: 'rgba(55, 53, 47, 0.4)',
      color: 'rgba(55, 53, 47, 0.4)',
      marginRight: 8,
      height: 28,
      width: 28,
    },
    label: {
      flex: 1,
    },
  }),
);

export interface BlockPlaceholderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  onClickDelete?: (event: React.MouseEvent) => void;
}

export const BlockPlaceholder: React.FC<BlockPlaceholderProps> = ({
  icon,
  label,
  className,
  onClickDelete,
  ...other
}) => {
  const classes = userStyles();

  return (
    <div
      contentEditable={false}
      role="button"
      tabIndex={0}
      className={clsx(classes.root, className)}
      {...other}
    >
      {icon && <span className={classes.icon}>{icon}</span>}
      <div className={classes.label}>{label}</div>
      {onClickDelete && (
        <IconButton onClick={onClickDelete}>
          <Clear />
        </IconButton>
      )}
    </div>
  );
};
