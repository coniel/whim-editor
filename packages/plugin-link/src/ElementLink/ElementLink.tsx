import React from 'react';
import { RenderElementProps } from '@braindrop-editor/core';
import { LinkElement } from '../LinkPlugin.types';

export interface ElementLinkProps extends RenderElementProps {
  element: LinkElement;
}

export const ElementLink: React.FC<ElementLinkProps> = ({
  attributes,
  children,
  element,
}) => {
  return (
    <a
      href={element.properties.url}
      {...attributes}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(): Window | null =>
        window.open(element.properties.url, '_blank')
      }
      style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'inherit' }}
    >
      <span
        style={{
          borderBottom: '0.05em solid rgba(55,53,47,0.4)',
          opacity: 0.7,
          transition: 'border-color 100ms ease-in, opacity 100ms ease-in',
        }}
      >
        {children}
      </span>
    </a>
  );
};
