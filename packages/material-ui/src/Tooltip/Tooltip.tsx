import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Tooltip as MuiTooltip } from '@material-ui/core';

export interface TooltipProps {
  children: React.ReactElement<any, any>;
  title: React.ReactNode;
  shortcut?: string;
  image?: string;
}

function addModifierKeys(shortcut: string): string {
  const ctrlModifier =
    navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl';
  const altModifier =
    navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? 'Option' : 'Alt';

  const modified = shortcut.replace('ctrl', ctrlModifier);
  return modified.replace('alt', altModifier);
}

export const useStyles = makeStyles((theme) =>
  createStyles({
    tooltip: {
      backgroundColor: '#0F0F0F',
      color: '#E7E7E7',
      fontSize: '12px',
      borderRadius: 3,
      boxShadow: theme.shadows[6],
    },
    tooltipPlacementBottom: {
      marginTop: 4,
    },
    tooltipPlacementTop: {
      marginBottom: 4,
    },
    image: {
      width: 140,
      height: 140,
      borderRadius: 3,
    },
    shortcut: {
      color: '#82817F',
      marginTop: 4,
    },
  }),
);

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  shortcut,
  image,
  children,
}) => {
  const classes = useStyles();

  const content = (
    <span>
      {image && <img src={image} className={classes.image} />}
      {title}
      {shortcut ? (
        <span className={classes.shortcut}>
          <br />
          {addModifierKeys(shortcut)}
        </span>
      ) : (
        ''
      )}
    </span>
  );

  return (
    <MuiTooltip
      placement="top"
      title={content}
      enterDelay={400}
      classes={{
        tooltip: classes.tooltip,
        tooltipPlacementBottom: classes.tooltipPlacementBottom,
        tooltipPlacementTop: classes.tooltipPlacementTop,
      }}
    >
      {children}
    </MuiTooltip>
  );
};
