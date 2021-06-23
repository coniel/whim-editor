import { v4 as uuid } from 'uuid';
import { Element as SlateElement, Text } from 'slate';
import { Element, BraindropEditor } from '../types';

export interface BlockIdPluginOptions {
  idGenerator?: () => string;
  ignoreTypes?: string[];
}

export const withBlockId = (
  editor: BraindropEditor,
  idGenerator?: () => string,
): BraindropEditor => {
  const generateId = idGenerator || uuid;

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

  const { renderElement } = editor;

  editor.renderElement = (props): JSX.Element => {
    return renderElement({
      ...props,
      attributes: {
        ...props.attributes,
        'data-block-id': props.element.id,
      },
    });
  };

  return editor;
};
