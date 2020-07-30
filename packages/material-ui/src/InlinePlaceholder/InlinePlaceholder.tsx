import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      userSelect: 'all',
      display: 'inline-flex',
      alignItems: 'center',
      verticalAlign: 'top',
      padding: '0 4px',
      borderRadius: 3,
      background: 'rgb(242,241,238)',
      color: 'rgba(55, 53, 47, 0.6)',
      lineHeight: '24px',
    },
    icon: {
      marginRight: 4,
      height: 16,
    },
  }),
);

export interface InlinePlaceholderProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  label: React.ReactNode;
  icon?: React.ReactNode;
}

const InlinePlaceholder: React.FC<InlinePlaceholderProps> = ({
  icon,
  label,
}) => {
  const classes = useStyles();
  return (
    <span className={classes.root}>
      {icon && <span className={classes.icon}>{icon}</span>}
      {label}
    </span>
  );
};

export default InlinePlaceholder;
