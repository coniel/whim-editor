import React, { useState } from 'react';

export interface HoveringToolbarButtonProps
  extends React.HTMLProps<HTMLDivElement> {
  active?: boolean;
}

export const HoveringToolbarButton = React.forwardRef<
  HTMLDivElement,
  HoveringToolbarButtonProps
>(({ children, active, ...other }, ref) => {
  const [hovering, setHovering] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  return (
    <div
      role="button"
      onMouseEnter={(): void => setHovering(true)}
      onMouseOut={(): void => setHovering(false)}
      onMouseDown={(): void => setMouseDown(true)}
      onMouseUp={(): void => setMouseDown(false)}
      style={{
        userSelect: 'none',
        transition: 'background 20ms ease-in 0s',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '0px 8px',
        color: active ? 'rgb(46, 170, 220)' : 'rgb(55, 53, 47)',
        fill: active ? 'rgb(46, 170, 220)' : 'rgb(55, 53, 47)',
        backgroundColor: hovering
          ? `rgb(55, 53, 47, ${mouseDown ? '0.16' : '0.08'})`
          : 'transparent',
      }}
      {...other}
      ref={ref}
    >
      {children}
    </div>
  );
});
