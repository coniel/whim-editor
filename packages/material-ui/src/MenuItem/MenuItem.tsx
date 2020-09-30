import React, { Children } from 'react';
import { ChevronRight } from '@material-ui/icons';
import clsx from 'clsx';
import {
  MenuItem as MuiMenuItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Tooltip } from '../Tooltip';

export interface MenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  hasSubmenu?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  icon?: React.ReactNode;
  image?: string;
  imageSize?: 'small' | 'large';
  secondaryText?: React.ReactNode;
  primaryText?: React.ReactNode;
  shortcut?: string;
  shortcutTooltip?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipImage?: string;
}

const userStyles = makeStyles((theme) =>
  createStyles({
    root: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 6,
      paddingRight: 6,
      borderRadius: 3,
      marginLeft: 6,
      marginRight: 6,
      '&:hover': {
        backgroundColor: '#DEEAFF',
        color: '#235CE0',
      },
    },
    listItemIcon: {
      minWidth: 18,
      marginRight: theme.spacing(1),
    },
    listItemAvatar: {
      minWidth: 0,
      marginRight: theme.spacing(1),
    },
    imageLarge: {
      borderRadius: 3,
      width: 38,
      height: 38,
      boxShadow: 'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px',
    },
    imageSmall: {
      borderRadius: 3,
      width: 24,
      height: 24,
      boxShadow: 'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px',
    },
    textPrimary: {
      fontSize: theme.typography.pxToRem(14),
    },
    textSecondary: {
      marginTop: 2,
      fontSize: theme.typography.pxToRem(12),
    },
    tooltipTitle: {
      marginBottom: 4,
      maxWidth: 140,
    },
    tooltipImage: {
      marginTop: 4,
      marginBottom: 4,
      borderRadius: 3,
      maxWidth: 140,
    },
    shortcut: {
      color: theme.palette.text.disabled,
      fontSize: theme.typography.pxToRem(12),
      padding: '2px 0 2px 2px',
    },
    submenuIcon: {
      marginRight: -6,
    },
  }),
);

const MenuItem: React.FC<MenuItemProps> = ({
  onClick,
  children,
  icon,
  image,
  imageSize = 'large',
  hasSubmenu,
  primaryText,
  secondaryText,
  tooltip,
  tooltipImage,
  shortcut: shortcutProp,
  shortcutTooltip,
  ...other
}) => {
  const classes = userStyles();

  let shortcut: React.ReactElement | string = '';

  if (shortcutProp) {
    shortcut = <div className={classes.shortcut}>{shortcutProp}</div>;

    if (shortcutTooltip) {
      shortcut = (
        <Tooltip placement="top" title={shortcutTooltip}>
          {shortcut}
        </Tooltip>
      );
    }
  }

  const menuItem = (
    <MuiMenuItem
      dense
      classes={{ root: classes.root }}
      {...other}
      onClick={onClick}
      button={onClick ? true : undefined}
    >
      {icon && (
        <ListItemIcon className={classes.listItemIcon}>{icon}</ListItemIcon>
      )}
      {image && (
        <ListItemAvatar className={clsx(classes.listItemAvatar)}>
          <Avatar
            src={image}
            className={clsx({
              [classes.imageLarge]: imageSize === 'large',
              [classes.imageSmall]: imageSize === 'small',
            })}
          />
        </ListItemAvatar>
      )}
      <ListItemText
        primary={primaryText}
        secondary={secondaryText}
        classes={{
          primary: classes.textPrimary,
          secondary: classes.textSecondary,
        }}
      >
        {children}
      </ListItemText>
      {shortcut}
      {hasSubmenu && (
        <ChevronRight color="disabled" className={classes.submenuIcon} />
      )}
    </MuiMenuItem>
  );

  if (tooltip || tooltipImage) {
    return (
      <Tooltip
        placement="right-start"
        title={
          <>
            {tooltipImage && (
              <div>
                <img src={tooltipImage} className={classes.tooltipImage} />
              </div>
            )}
            <div className={classes.tooltipTitle}>{tooltip}</div>
          </>
        }
      >
        {menuItem}
      </Tooltip>
    );
  }

  return menuItem;
};

export default MenuItem;
