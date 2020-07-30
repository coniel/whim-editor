import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const userStyles = makeStyles(() =>
  createStyles({
    root: {
      margin: '4px 0',
      transition: 'background 50ms ease-in 0s',
      userSelect: 'none',
      outline: 'none',
      display: 'flex',
      alignItems: 'center',
      padding: '12px 36px 12px 12px',
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
      fill: 'rgba(55, 53, 47, 0.4)',
      color: 'rgba(55, 53, 47, 0.4)',
      marginRight: 8,
      height: 28,
      width: 28,
    },
  }),
);

export interface BlockPlaceholderProps {
  label: React.ReactNode;
  icon?: React.ReactNode;
}

const BlockPlaceholder: React.FC<BlockPlaceholderProps> = ({
  icon,
  label,
  ...other
}) => {
  const classes = userStyles();

  return (
    <div role="button" tabIndex={0} className={classes.root} {...other}>
      {icon && <span className={classes.icon}>{icon}</span>}
      {label}
    </div>
  );
};

export default BlockPlaceholder;
