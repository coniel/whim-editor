import React, { useCallback, useState } from 'react';
import { createContext } from '../utils';

export interface EditorStateContextValue {
  toggles: Record<string, boolean>;
  toggle: (key: string) => boolean;
  invert: (key: string) => void;
  turnOn: (key: string) => void;
  turnOff: (key: string) => void;
}

const [hook, Provider] = createContext<EditorStateContextValue>();

export const EditorStateProvider: React.FC = ({ children }) => {
  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  const toggle = useCallback(
    (key: string) => {
      return !!toggles[key];
    },
    [toggles],
  );

  const invert = useCallback((key: string) => {
    setToggles((value) => ({ ...value, [key]: !value[key] }));
  }, []);

  const turnOn = useCallback((key: string) => {
    setToggles((value) => ({ ...value, [key]: true }));
  }, []);

  const turnOff = useCallback((key: string) => {
    setToggles((value) => ({ ...value, [key]: false }));
  }, []);

  return (
    <Provider value={{ toggles, toggle, turnOff, turnOn, invert }}>
      {children}
    </Provider>
  );
};

export const useEditorState = hook;
