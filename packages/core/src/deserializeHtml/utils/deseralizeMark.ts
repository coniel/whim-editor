// import { setPropsToNodes } from 'common/transforms';
import { CombinedMarkDeserializers } from '../../withPlugins';
import { Node, Text } from 'slate';
import { jsx } from 'slate-hyperscript';

export interface DeserializeMarksProps {
  deserializers: CombinedMarkDeserializers;
  el: HTMLElement;
  children: (Node | null)[];
}

export default ({
  deserializers,
  el,
  children,
}: DeserializeMarksProps): Text[] | undefined => {
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

      if (child.children) {
        // setPropsToNodes(child, props, {
        //   filter: Text.isText,
        // });
        arr.push(child);
      } else {
        arr.push(jsx('text', props, child));
      }

      return arr;
    }, []);
  }

  if (deserializers['*']) {
    console.log('has *', deserializers['*']);

    const props = deserializers['*'].reduce((obj, tag) => {
      console.log('el', el);

      const newProps = tag(el);
      if (newProps) {
        Object.assign(obj, newProps);
      }
      return obj;
    }, {});

    console.log('props', props);

    return children.reduce((arr: any[], child) => {
      if (!child) return arr;

      if (child.children) {
        // setPropsToNodes(child, props, {
        //   filter: Text.isText,
        // });
        arr.push(child);
      } else {
        arr.push(jsx('text', props, child));
      }

      return arr;
    }, []);
  }
};
