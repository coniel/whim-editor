import { CombinedMarkDeserializers } from '../../withPlugins';
import { Node, Text } from 'slate';
import { jsx } from 'slate-hyperscript';

export interface DeserializeMarksProps {
  deserializers: CombinedMarkDeserializers;
  el: HTMLElement;
  children: (Node | null)[];
}

export function deseralizeMark({
  deserializers,
  el,
  children,
}: DeserializeMarksProps): Text[] | undefined {
  const type = el.getAttribute('data-slate-type') || el.nodeName;

  if (deserializers[type]) {
    const props = deserializers[type].reduce((obj, tag) => {
      const newProps = tag(el);
      if (newProps) {
        Object.assign(obj, newProps);
      }
      return obj;
    }, {});

    return children.reduce((arr: any[], child) => {
      if (!child) return arr;

      if (Text.isText(child)) {
        arr.push(jsx('text', props, child));
      } else {
        arr.push(child);
      }

      return arr;
    }, []);
  }

  if (deserializers['*']) {
    const props = deserializers['*'].reduce((obj, tag) => {
      const newProps = tag(el);
      if (newProps) {
        Object.assign(obj, newProps);
      }
      return obj;
    }, {});

    return children.reduce((arr: any[], child) => {
      if (!child) return arr;

      if (Text.isText(child)) {
        arr.push(jsx('text', props, child));
      } else {
        arr.push(child);
      }

      return arr;
    }, []);
  }
}
