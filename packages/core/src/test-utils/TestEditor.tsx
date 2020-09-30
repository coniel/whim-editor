import React from 'react';
import { Node } from 'slate';
import Editor from '../Editor';
import { components } from '../test-utils';

export interface TestEditorProps {
  value?: Node[];
  onChange?: (value: Node[]) => null;
}

export const TestEdtior: React.FC<TestEditorProps> = ({
  value = [{ type: 'text', children: [{ text: '' }] }],
  onChange = () => null,
}) => <Editor components={components} value={value} onChange={onChange} />;
