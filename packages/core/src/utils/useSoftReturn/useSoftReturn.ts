import isHotkey, { HotKeyOptions } from 'is-hotkey';

type Event =
  | React.KeyboardEvent<HTMLInputElement>
  | React.KeyboardEvent<HTMLTextAreaElement>
  | React.KeyboardEvent<HTMLDivElement>;

export type UseSoftReturn = (
  onSoftReturn: (event: Event) => void,
) => (event: Event) => void;

export const useSoftReturn: UseSoftReturn = (onSoftReturn) => {
  return (event: Event): void => {
    if (isHotkey('shift+Enter', (event as unknown) as HotKeyOptions)) {
      event.preventDefault();
      onSoftReturn(event);
    }
  };
};
