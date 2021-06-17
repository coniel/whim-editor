import { v4 as uuid } from 'uuid';
import { Element as SlateElement, Text } from 'slate';
import {
  SlashPluginFactory,
  SlashPlugin,
  SlashEditor,
  Element,
  RenderElementProps as CoreRenderElementProps,
} from '@sheets-editor/core';

export interface ElementWithId extends Element {
  id: string;
}

export interface RenderElementProps extends CoreRenderElementProps {
  attributes: {
    'data-slate-node': 'element';
    'data-block-id': string;
    'data-slate-inline'?: true;
    'data-slate-void'?: true;
    dir?: 'rtl';
    ref: any;
  };
  element: ElementWithId;
}

export type RenderElement = (props: RenderElementProps) => JSX.Element;

export interface EditorWithBlockIdPlugin
  extends Omit<SlashEditor, 'renderElement'> {
  renderElement: RenderElement;
  children: ElementWithId[];
}

export interface BlockIdPluginOptions {
  idGenerator?: () => string;
  ignoreTypes?: string[];
}

const BlockIdPlugin = (
  options: BlockIdPluginOptions = {},
): SlashPluginFactory => (editor: SlashEditor): SlashPlugin => {
  const generateId = options.idGenerator || uuid;

  const { apply } = editor;

  // Add ID to new nodes
  editor.apply = (operation): void => {
    if (
      operation.type === 'split_node' &&
      (operation.properties as Element).type &&
      !editor.isInline({
        ...operation.properties,
        children: [],
      } as SlateElement)
    ) {
      return apply({
        ...operation,
        properties: {
          ...operation.properties,
          id: generateId(),
        },
      });
    }
    if (
      operation.type === 'insert_node' &&
      !Text.isText(operation.node) &&
      SlateElement.isElement(operation.node) &&
      !editor.isInline(operation.node)
    ) {
      const { node } = operation;
      if (SlateElement.isElement(node)) {
        return apply({
          ...operation,
          node: {
            ...node,
            id: generateId(),
          },
        });
      }
    }

    apply(operation);
  };

  const { renderElement } = editor as EditorWithBlockIdPlugin;

  (editor as EditorWithBlockIdPlugin).renderElement = (props): JSX.Element => {
    return renderElement({
      ...props,
      attributes: {
        ...props.attributes,
        'data-block-id': props.element.id,
      },
    });
  };

  return {};
};

export default BlockIdPlugin;
