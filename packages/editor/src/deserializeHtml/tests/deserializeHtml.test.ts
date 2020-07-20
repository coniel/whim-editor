import deserialize from '../createHtmlDeserializer';
import richText from './html-samples/rich-text';
import elements from './html-samples/elements';
import richTextElements from './html-samples/rich-text-elements';

Object.defineProperty(Array.prototype, 'flat', {
  value: function (depth = 1) {
    return this.reduce(function (flat: unknown[], toFlatten: unknown) {
      return flat.concat(
        Array.isArray(toFlatten) && depth > 1
          ? toFlatten.flat(depth - 1)
          : toFlatten,
      );
    }, []);
  },
});

describe('deserializeHtml', () => {
  it('should deserialize text nodes', () => {
    const parsed = new DOMParser().parseFromString(richText, 'text/html');

    const fragment = deserialize(parsed.body, {}, {});

    expect(fragment[0].text).toBe(
      'Bold text, Italic text, Strikethorugh text, Combined bold and italic text',
    );
  });

  it('should deserialize elements', () => {
    const parsed = new DOMParser().parseFromString(elements, 'text/html');

    const fragment = deserialize(
      parsed.body,
      {
        DIV: () => ({ type: 'paragraph' }),
        P: () => ({ type: 'paragraph' }),
        H2: () => ({ type: 'heading-2' }),
        H3: () => ({ type: 'heading-3' }),
        UL: () => ({ type: 'unordered-list' }),
        LI: () => ({ type: 'list-item' }),
      },
      {},
    );

    expect(fragment[0].type).toBe('paragraph');
    expect(fragment[1].type).toBe('paragraph');
    expect(fragment[2].type).toBe('heading-2');
    expect(fragment[3].type).toBe('paragraph');
    expect(fragment[4].type).toBe('heading-3');
    expect(fragment[5].type).toBe('paragraph');
    expect(fragment[6].type).toBe('unordered-list');
    expect(fragment[6].children[0].type).toBe('list-item');
  });

  it('should deserialize marks', () => {
    const parsed = new DOMParser().parseFromString(richText, 'text/html');

    const fragment = deserialize(
      parsed.body,
      {},
      {
        STRONG: [() => ({ bold: true })],
        EM: [() => ({ italic: true })],
        SPAN: [
          (el) =>
            el.style.textDecoration === 'line-through' && {
              strikethrough: true,
            },
        ],
      },
    );

    expect(fragment[0].bold).toBeTruthy();
    expect(fragment[2].italic).toBeTruthy();
    expect(fragment[4].strikethrough).toBeTruthy();
    expect(fragment[6].bold).toBeTruthy();
    expect(fragment[6].italic).toBeTruthy();
  });

  it('should deserialize marks and elements together', () => {
    const parsed = new DOMParser().parseFromString(
      richTextElements,
      'text/html',
    );

    const fragment = deserialize(
      parsed.body,
      {
        P: () => ({ type: 'paragraph' }),
      },
      {
        STRONG: [() => ({ bold: true })],
        EM: [() => ({ italic: true })],
        SPAN: [
          (el) =>
            el.style.textDecoration === 'line-through' && {
              strikethrough: true,
            },
        ],
      },
    );

    expect(fragment).toMatchSnapshot();
  });
});
