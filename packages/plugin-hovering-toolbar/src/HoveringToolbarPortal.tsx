import React from 'react';
import ReactDOM from 'react-dom';

export const HoveringToolbarPortal = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactPortal => {
  return ReactDOM.createPortal(children, document.body);
};
