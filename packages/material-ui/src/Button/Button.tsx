import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import MuiButton from '@material-ui/core/Button';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: 'submit' | 'button';
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      textTransform: 'none',
    },
    endIcon: {
      marginLeft: 0,
    },
  }),
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onClick, startIcon, endIcon, style, type }, ref) => {
    const classes = useStyles();

    return (
      <MuiButton
        ref={ref}
        size="small"
        variant="outlined"
        type={type}
        onClick={onClick}
        classes={classes}
        startIcon={startIcon}
        endIcon={endIcon}
        style={style}
      >
        {children}
      </MuiButton>
    );
  },
);

Button.displayName = 'Button';

export default Button;
