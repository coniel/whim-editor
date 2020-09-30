import React from 'react';
import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export const MenuDivider: React.FC = ({ ...other }) => {
  const classes = useStyles();

  return <Divider className={classes.root} {...other} />;
};
