import React from 'react';
import Button from '../Button';
import { Tooltip } from './Tooltip';

export default {
  title: 'material-ui|Tooltip',
  component: Tooltip,
};

export const Default: React.FC = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Tooltip title="Title">
        <Button style={{ marginRight: 8 }}>Title only</Button>
      </Tooltip>
      <Tooltip title="Title" shortcut="mod+B">
        <Button>With shortcut</Button>
      </Tooltip>
      {/* <Tooltip title="Title" image={require('./image.png')}>
        <Button  style={{ marginLeft: 8 }}>With image</Button>
      </Tooltip> */}
    </div>
  );
};
