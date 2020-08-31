import React from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const userStyles = makeStyles(() =>
  createStyles({
    root: {
      fontSize: '14px',
      boxSizing: 'border-box',
      height: 26,
      padding: '3px 6px',
      borderRadius: 3,
      boxShadow:
        'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px inset, rgba(15, 15, 15, 0.1) 0px 1px 1px inset',
      backgroundColor: 'rgba(242, 241, 238, 0.6)',
    },
    focused: {
      boxShadow:
        'rgba(46, 170, 220, 0.7) 0px 0px 0px 1px inset, rgba(46, 170, 220, 0.4) 0px 0px 0px 2px !important',
    },
  }),
);

export type TextFieldProps = React.HTMLProps<HTMLInputElement>;

const TextField: React.FC<TextFieldProps> = (props) => {
  const classes = userStyles();

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return <InputBase classes={classes} {...props} />;
};

export default TextField;
