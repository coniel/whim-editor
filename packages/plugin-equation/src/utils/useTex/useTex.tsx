import { useState } from 'react';
import { parseTex, ParseTexOptions } from '../parseTex';

export interface UseTexHook {
  html: string;
  error: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function useTex(
  defaultValue: string,
  options: ParseTexOptions = {},
): UseTexHook {
  const [value, setValue] = useState<string>(defaultValue);
  const [error, setError] = useState('');
  const [html, setHtml] = useState<string>(
    parseTex(defaultValue, {
      ...options,
      throwOnError: false,
    }).html,
  );

  function onChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    const newValue = event.target.value;
    setValue(newValue);

    const tex = parseTex(newValue, {
      ...options,
      throwOnError: true,
    });
    if (!tex.error) {
      setHtml(tex.html);
    }
    setError(tex.error);
  }

  return { html, error, value, onChange };
}
