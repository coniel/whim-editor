import React from 'react';
import { render } from '@testing-library/react';
import { withReact } from 'slate-react';
import { createEditor, Node, Range } from 'slate';
import withPlugins, { SlashEditor, SlashPluginFactory } from './withPlugins';

const baseEditor = withReact(createEditor());
const onKeyDownFn1 = jest.fn();
const onKeyDownFn2 = jest.fn();
const range1 = {} as Range;
const range2 = {} as Range;

const testPlugin1: SlashPluginFactory = () => ({
  renderElement: ({
    element,
    attributes,
    children,
  }): JSX.Element | undefined => {
    if (element.type === 'test-element-1') {
      return (
        <div {...attributes}>
          TEST_ELEMENT_1<span>{children}</span>
        </div>
      );
    }
  },
  renderLeaf: ({ leaf, children }): JSX.Element => {
    if (leaf.bold) {
      return (
        <span>
          TEST_LEAF_BOLD<span>{children}</span>
        </span>
      );
    }

    return children;
  },
  onKeyDown: onKeyDownFn1,
  decorate: ([, path]): Range[] | undefined => {
    if (path[0] === 1) {
      return [range1];
    }
  },
});

const testPlugin2: SlashPluginFactory = () => ({
  renderElement: ({
    element,
    attributes,
    children,
  }): JSX.Element | undefined => {
    if (element.type === 'test-element-2') {
      return (
        <div {...attributes}>
          TEST_ELEMENT_2<span>{children}</span>
        </div>
      );
    }
  },
  renderLeaf: ({ leaf, children }): JSX.Element => {
    if (leaf.italic) {
      return (
        <span>
          TEST_LEAF_ITALIC<span>{children}</span>
        </span>
      );
    }

    return children;
  },
  onKeyDown: onKeyDownFn2,
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
          attributes: { 'data-slate-node': 'element', ref: React.createRef() },
          children: 'Element',
          element: { type: 'text', children: [{ text: '' }] },
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
          attributes: { 'data-slate-node': 'element', ref: React.createRef() },
          children: 'CHILDREN_1',
          element: { type: 'test-element-1', children: [{ text: '' }] },
        }),
      );

      const element = container.querySelector('[data-slate-node="element"]');

      expect(element).not.toBeNull();
      getByText('TEST_ELEMENT_1');
      getByText('CHILDREN_1');

      // testPlugin2
      rerender(
        editor.renderElement({
          attributes: { 'data-slate-node': 'element', ref: React.createRef() },
          children: 'CHILDREN_2',
          element: { type: 'test-element-2', children: [{ text: '' }] },
        }),
      );

      expect(element).not.toBeNull();
      getByText('TEST_ELEMENT_2');
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
      getByText('TEST_LEAF_BOLD');
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
      getByText('TEST_LEAF_ITALIC');
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
});
