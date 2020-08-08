/* eslint-disable @typescript-eslint/no-explicit-any */
import { createHyperscript } from 'slate-hyperscript';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      editor: any;
      mention: any;
      actionitem: any;
      inline: any;
      element: any;
      block: any;
      cursor: any;
      anchor: any;
      focus: any;
    }
  }
}

const jsx = createHyperscript({
  elements: {
    block: {},
    inline: { inline: true },
  },
});

export default jsx;
