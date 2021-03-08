import React from 'react';
import { render } from '@testing-library/react';
import { withReact, RenderLeafProps } from 'slate-react';
import { createEditor, Node, Range } from 'slate';
import withPlugins, {
  Element,
  SlashEditor,
  SlashPluginFactory,
  RenderElementProps,
} from './withPlugins';

const createElement = (type: string): Element => ({
  type,
  children: [{ text: '' }],
});

const baseEditor = withReact(createEditor());
const onKeyDownFn1 = jest.fn();
const onKeyDownFn2 = jest.fn();
const onDOMBeforeInputFn1 = jest.fn();
const onDOMBeforeInputFn2 = jest.fn();
const range1 = {} as Range;
const range2 = {} as Range;

const testPlugin1: SlashPluginFactory = () => ({
  renderElement: ({
    element,
    attributes,
    children,
  }): JSX.Element | undefined => {
    if (element.type === 'plug-1-elem-1') {
      return (
        <div {...attributes}>
          PLUG_1_ELEM_1<span>{children}</span>
        </div>
      );
    } else if (element.type === 'plug-1-elem-2') {
      return (
        <div {...attributes}>
          PLUG_1_ELEM_2<span>{children}</span>
        </div>
      );
    }
  },
  renderLeaf: ({ leaf, children }): JSX.Element => {
    if (leaf.bold) {
      return (
        <span>
          LEAF_BOLD<span>{children}</span>
        </span>
      );
    }

    return children;
  },
  elements: [
    {
      component: ({
        children,
        attributes,
      }: RenderElementProps): JSX.Element => (
        <div {...attributes}>
          PLUG_1_ELEM_3<span>{children}</span>
        </div>
      ),
      type: 'plug-1-elem-3',
      isVoid: true,
      isInline: true,
    },
  ],
  isVoid: (element): boolean => element.type === 'plug-1-elem-2',
  isInline: (element): boolean => element.type === 'plug-1-elem-2',
  onKeyDown: onKeyDownFn1,
  onDOMBeforeInput: onDOMBeforeInputFn1,
  decorate: ([, path]): Range[] | undefined => {
    if (path[0] === 1) {
      return [range1];
    }
  },
});

const testPlugin2: SlashPluginFactory = () => ({
  elements: [
    {
      component: ({
        children,
        attributes,
      }: RenderElementProps): JSX.Element => (
        <div {...attributes}>
          PLUG_2_ELEM_1<span>{children}</span>
        </div>
      ),
      type: 'plug-2-elem-1',
    },
    {
      component: ({
        children,
        attributes,
      }: RenderElementProps): JSX.Element => (
        <div {...attributes}>
          PLUG_2_ELEM_2<span>{children}</span>
        </div>
      ),
      isVoid: true,
      isInline: true,
      type: 'plug-2-elem-2',
    },
    {
      component: ({
        children,
        attributes,
      }: RenderElementProps): JSX.Element => (
        <div {...attributes}>
          PLUG_2_ELEM_3<span>{children}</span>
        </div>
      ),
      isVoid: true,
      isInline: true,
      type: 'plug-2-elem-3',
    },
    {
      component: ({
        children,
        attributes,
      }: RenderElementProps): JSX.Element => (
        <div {...attributes}>
          PLUG_2_ELEM_4<span>{children}</span>
        </div>
      ),
      type: 'plug-2-elem-4',
    },
  ],
  leaves: [
    {
      component: ({ children }: RenderLeafProps): JSX.Element => (
        <span>
          LEAF_ITALIC<span>{children}</span>
        </span>
      ),
      mark: 'italic',
    },
  ],
  isVoid: (element): boolean => element.type === 'plug-2-elem-4',
  isInline: (element): boolean => element.type === 'plug-2-elem-4',
  onKeyDown: onKeyDownFn2,
  onDOMBeforeInput: onDOMBeforeInputFn2,
  decorate: ([, path]): Range[] | undefined => {
    if (path[0] === 2) {
      return [range2];
    }
  },
});

// A plugin which does nothing in order to
// test the alternate code branches for when
// a plugin does not define a certain callback
const testPlugin3: SlashPluginFactory = () => ({});

describe('Editor', () => {
  let editor: SlashEditor;

  beforeAll(() => {
    editor = withPlugins(baseEditor, [testPlugin1, testPlugin2, testPlugin3]);
  });

  describe('renderElement', () => {
    it('should render base Element by default', () => {
      const { getByText, container } = render(
        editor.renderElement({
          attributes: {
            'data-slate-node': 'element',
            ref: React.createRef(),
          },
          children: 'Element',
          element: createElement('text'),
        }),
      );

      const element = container.querySelector('[data-slate-node="element"]');

      expect(element).not.toBeNull();
      getByText('Element');
    });

    it('should render plugin elements', () => {
      // testPlugin1
      const { getByText, container, rerender } = render(
        editor.renderElement({
          attributes: {
            'data-slate-node': 'element',
            ref: React.createRef(),
          },
          children: 'CHILDREN_1',
          element: createElement('plug-1-elem-1'),
        }),
      );

      const element = container.querySelector('[data-slate-node="element"]');

      expect(element).not.toBeNull();
      getByText('PLUG_1_ELEM_1');
      getByText('CHILDREN_1');

      // testPlugin2
      rerender(
        editor.renderElement({
          attributes: {
            'data-slate-node': 'element',
            ref: React.createRef(),
          },
          children: 'CHILDREN_2',
          element: createElement('plug-2-elem-1'),
        }),
      );

      expect(element).not.toBeNull();
      getByText('PLUG_2_ELEM_1');
      getByText('CHILDREN_2');
    });
  });

  describe('renderLeaf', () => {
    it('should render base Leaf by default', () => {
      const { getByText, container } = render(
        editor.renderLeaf({
          leaf: { text: 'Some text' },
          attributes: { 'data-slate-leaf': true },
          children: 'Leaf',
          text: { text: 'Some text' },
        }),
      );

      const element = container.querySelector('[data-slate-leaf="true"]');

      expect(element).not.toBeNull();
      getByText('Leaf');
    });

    it('should render plugin leaves', () => {
      // testPlugin1
      const { getByText, container, rerender } = render(
        editor.renderLeaf({
          leaf: { text: 'Some text', bold: true },
          attributes: { 'data-slate-leaf': true },
          children: 'CHILDREN_1',
          text: { text: 'Some text' },
        }),
      );

      const element = container.querySelector('[data-slate-leaf="true"]');

      expect(element).not.toBeNull();
      getByText('LEAF_BOLD');
      getByText('CHILDREN_1');

      // testPlugin2
      rerender(
        editor.renderLeaf({
          leaf: { text: 'Some text', italic: true },
          attributes: { 'data-slate-leaf': true },
          children: 'CHILDREN_2',
          text: { text: 'Some text' },
        }),
      );

      expect(element).not.toBeNull();
      getByText('LEAF_ITALIC');
      getByText('CHILDREN_2');
    });
  });

  describe('decorate', () => {
    it('should return an empty array by default', () => {
      expect(editor.decorate([{} as Node, [0, 0]])).toEqual([]);
    });

    it("should call plugins' decorate", () => {
      expect(editor.decorate([{} as Node, [1, 0]])[0]).toBe(range1);
      expect(editor.decorate([{} as Node, [2, 0]])[0]).toBe(range2);
    });
  });

  describe('onKeyDown', () => {
    it('should be defined but do nothing', () => {
      expect(() =>
        editor.onKeyDown({} as React.KeyboardEvent<HTMLDivElement>),
      ).not.toThrow();
    });

    it("should call plugins' onKeyDown", () => {
      editor.onKeyDown({} as React.KeyboardEvent<HTMLDivElement>);
      expect(onKeyDownFn1).toHaveBeenCalled();
      expect(onKeyDownFn2).toHaveBeenCalled();
    });
  });

  describe('onDOMBeforeInput', () => {
    it('should be defined but do nothing', () => {
      expect(() => editor.onDOMBeforeInput({} as Event)).not.toThrow();
    });

    it("should call plugins' onDOMBeforeInput", () => {
      editor.onDOMBeforeInput({} as Event);
      expect(onDOMBeforeInputFn1).toHaveBeenCalled();
      expect(onDOMBeforeInputFn2).toHaveBeenCalled();
    });
  });

  describe('isVoid', () => {
    it("should call plugin's isVoid", () => {
      expect(editor.isVoid(createElement('plug-1-elem-2'))).toBe(true);
      expect(editor.isVoid(createElement('plug-2-elem-4'))).toBe(true);
    });

    it("should check plugin element's isVoid", () => {
      expect(editor.isVoid(createElement('plug-1-elem-3'))).toBe(true);
      expect(editor.isVoid(createElement('plug-2-elem-2'))).toBe(true);
      expect(editor.isVoid(createElement('plug-2-elem-3'))).toBe(true);
    });
  });

  describe('isInline', () => {
    it("should call plugin's isInline", () => {
      expect(editor.isInline(createElement('plug-1-elem-2'))).toBe(true);
      expect(editor.isInline(createElement('plug-2-elem-4'))).toBe(true);
    });

    it("should check plugin element's isInline", () => {
      expect(editor.isInline(createElement('plug-1-elem-3'))).toBe(true);
      expect(editor.isInline(createElement('plug-2-elem-2'))).toBe(true);
      expect(editor.isInline(createElement('plug-2-elem-3'))).toBe(true);
    });
  });
});
