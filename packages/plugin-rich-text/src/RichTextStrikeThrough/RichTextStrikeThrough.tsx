import React from 'react';

export const RichTextStrikeThrough: React.FC = ({ children }) => (
  <span style={{ textDecoration: 'line-through' }}>{children}</span>
);
