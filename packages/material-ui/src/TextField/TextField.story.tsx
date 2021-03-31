import React from 'react';
import TextField from './TextField';

export default {
  title: 'UI/TextField',
  component: TextField,
};

export const Default: React.FC = () => {
  return <TextField placeholder="Text field" />;
};
