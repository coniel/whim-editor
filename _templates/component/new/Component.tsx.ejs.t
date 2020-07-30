---
to: packages/<%= package %>/src/<%= name %>/<%= name %>.tsx
---
import React from 'react';
<% if(locals.styled){ -%>
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
<% } -%>

<% if(locals.styled){ -%>
const styles = createStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
});

<% } -%>
export interface <%= name %>Props<% if(locals.styled){ %> extends WithStyles<typeof styles><% } %> {
  onClick?: () => void;
}

const <%= name %>: React.FC<<%= name %>Props> = ({
  children,
  <% if(locals.styled){ -%>
  classes,
  <% } -%>
  onClick,
}) => {
  return (
    <button onClick={onClick}<% if(locals.styled){ -%> className={classes.root}<% } -%>>
      {children}
    </button>
  );
};

<% if(!locals.styled){ -%>
export default <%= name %>;
<% } -%>
<% if(locals.styled){ -%>
export default withStyles(styles)(<%= name %>);
<% } -%>