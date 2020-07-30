import React from 'react';
import { RenderElementProps } from 'slate-react';
import ElementBlock from './ElementBlock';

function renderBlockElement(props: RenderElementProps): JSX.Element | undefined {
  const { element } = props;

  if (element.type === 'foo') {
    return <ElementBlock {...props} />;
  }

  return;
}

export default renderBlockElement;
