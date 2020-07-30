import isHotkey, { HotKeyOptions } from 'is-hotkey';

type Event =
  | React.KeyboardEvent<HTMLInputElement>
  | React.KeyboardEvent<HTMLTextAreaElement>
  | React.KeyboardEvent<HTMLDivElement>;

export type UseHardReturn = (
  onHardReturn: (event: Event) => void,
) => (event: Event) => void;

const useHardReturn: UseHardReturn = (onHardReturn) => {
  return (event: Event): void => {
    const { key } = event;
    if (
      key === 'Enter' &&
      !isHotkey('shift+Enter', (event as unknown) as HotKeyOptions)
    ) {
      event.preventDefault();
      onHardReturn(event);
    }
  };
};

export default useHardReturn;
