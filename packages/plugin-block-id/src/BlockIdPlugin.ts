import { v4 as uuid } from 'uuid';
import { Element as SlateElement, Text } from 'slate';
import {
  SlashPluginFactory,
  SlashPlugin,
  SlashEditor,
  Element as CoreElement,
  RenderElementProps as CoreRenderElementProps,
} from '@sheets-editor/core';

export interface Element extends CoreElement {
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
  element: Element;
}

export type RenderElement = (props: RenderElementProps) => JSX.Element;

export interface EditorWithBlockIdPlugin
  extends Omit<SlashEditor, 'renderElement'> {
  renderElement: RenderElement;
}

export interface BlockIdPluginOptions {
  idGenerator?: () => string;
  ignoreTypes?: string[];
}

const BlockIdPlugin = (
  options: BlockIdPluginOptions = {},
): SlashPluginFactory => (editor: SlashEditor): SlashPlugin => {
  const generateId = options.idGenerator || uuid;
  const ignore = options.ignoreTypes || [];

  const { apply } = editor;

  // Add ID to new nodes
  editor.apply = (operation): void => {
    if (
      operation.type === 'split_node' &&
      !editor.isInline({ ...operation.properties, children: [] })
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
