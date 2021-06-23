import React, { useCallback, useState } from 'react';
import { createContext } from '@braindrop-editor/core';

export interface LinkPluginStateContext {
  popoverOpen: boolean;
  openLinkPopover: () => void;
  closeLinkPopover: () => void;
}

const [hook, Provider] = createContext<LinkPluginStateContext>();

export const LinkStateProvider: React.FC = ({ children }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const openLinkPopover = useCallback(() => {
    setPopoverOpen(true);
  }, []);

  const closeLinkPopover = useCallback(() => {
    setPopoverOpen(true);
  }, []);

  return (
    <Provider value={{ popoverOpen, openLinkPopover, closeLinkPopover }}>
      {children}
    </Provider>
  );
};

export const useLinkPluginState = hook;
