import React from 'react';

const RichTextStrikeThrough: React.FC = ({ children }) => (
  <span style={{ textDecoration: 'line-through' }}>{children}</span>
);

export default RichTextStrikeThrough;
