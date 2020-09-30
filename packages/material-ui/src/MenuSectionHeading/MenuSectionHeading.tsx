import React from 'react';
import { ListSubheader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.overline,
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    lineHeight: '12px',
  },
}));

export const MenuSectionHeading: React.FC = ({ children, ...other }) => {
  const classes = useStyles();

  return (
    <ListSubheader disableSticky className={classes.root} {...other}>
      {children}
    </ListSubheader>
  );
};
