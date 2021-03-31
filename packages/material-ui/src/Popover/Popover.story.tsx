import React, { useState } from 'react';
import Popover from './Popover';

export default { title: 'UI/Popover', component: Popover };

export const Default: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggle = (): void => setOpen(!open);

  return (
    <div>
      <button onClick={toggle}>Open</button>
      <Popover
        anchorPosition={{ top: 200, left: 200 }}
        open={open}
        onClose={toggle}
      >
        <div>Popover content</div>
      </Popover>
    </div>
  );
};
