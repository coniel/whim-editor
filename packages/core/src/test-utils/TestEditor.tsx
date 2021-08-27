import React from 'react';
import { Descendant } from 'slate';
import { Editor } from '../Editor';
import { components } from '../test-utils';

export interface TestEditorProps {
  value?: Descendant[];
  onChange?: (value: Descendant[]) => null;
}

export const TestEdtior: React.FC<TestEditorProps> = ({
  value = [
    {
      type: 'text',
      id: 'first-element',
      children: [{ text: '' }],
    },
  ],
  onChange = () => null,
}) => <Editor components={components} value={value} onChange={onChange} />;
