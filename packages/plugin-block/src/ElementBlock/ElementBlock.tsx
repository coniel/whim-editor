import React from 'react';
import { RenderElementProps } from 'slate-react';

export interface ElementBlockProps extends RenderElementProps {
  foo?: string;
}

const ElementBlock: React.FC<ElementBlockProps> = ({
  attributes,
  children,
  element,
}) => {
  return <div {...attributes}>{children}</div>;
};

export default ElementBlock;
