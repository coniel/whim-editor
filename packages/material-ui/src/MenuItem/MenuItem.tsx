import React from 'react';
import MuiMenuItem, {
  MenuItemProps as MuiMenuItemProps,
} from '@material-ui/core/MenuItem';

import { makeStyles, createStyles } from '@material-ui/core/styles';

const userStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: 28,
    },
  }),
);

export type MenuItemProps = Omit<MuiMenuItemProps, 'button'>;

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const classes = userStyles();

  return <MuiMenuItem dense classes={classes} {...props} button />;
};

export default MenuItem;
