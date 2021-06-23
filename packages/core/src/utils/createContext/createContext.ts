import React from 'react';

export function createContext<ContextType>(): [
  () => ContextType,
  React.Provider<ContextType | undefined>,
  React.Consumer<ContextType>,
] {
  const context = React.createContext<ContextType | undefined>(undefined);

  function useContext(): ContextType {
    const c = React.useContext(context);
    if (!c) throw new Error('useCtx must be inside a Provider with a value');
    return c;
  }
  return [
    useContext,
    context.Provider,
    context.Consumer as React.Consumer<ContextType>,
  ];
}
