import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const userStyles = makeStyles(() =>
  createStyles({
    root: {
      margin: '4px 0',
      transition: 'background 50ms ease-in 0s',
      userSelect: 'none',
      outline: 'none',
      borderRadius: 3,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#EDECE9',
      },
    },
  }),
);

export interface VoidBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: (event: React.MouseEvent) => void;
}

export const VoidBlock: React.FC<VoidBlockProps> = ({ children, ...other }) => {
  const classes = userStyles();

  return (
    <div role="button" tabIndex={0} className={classes.root} {...other}>
      {children}
    </div>
  );
};
