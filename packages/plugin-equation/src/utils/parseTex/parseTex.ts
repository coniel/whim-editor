import katex, { KatexOptions } from 'katex';

export type ParseTexOptions = KatexOptions;

export function parseTex(
  value: string,
  options: ParseTexOptions,
): { html: string; error: string } {
  let html = '';
  let error = '';

  try {
    html = katex.renderToString(value as string, {
      ...options,
    });
  } catch (err) {
    error = err.message.replace('KaTeX parse error: ', '');
  }

  return { html, error };
}
