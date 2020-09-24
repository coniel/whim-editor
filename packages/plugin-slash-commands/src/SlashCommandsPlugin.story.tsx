import React, { useState } from 'react';
import { Node } from 'slate';
import components from '@sheets-editor/material-ui';
import { Editor } from '@sheets-editor/core';
import createHeadingPlugin from '@sheets-editor/plugin-heading';
import createOLPlugin from '@sheets-editor/plugin-ordered-list';
import createULPlugin from '@sheets-editor/plugin-unordered-list';
import createCodePlugin from '@sheets-editor/plugin-code';
import createEquationPlugin from '@sheets-editor/plugin-equation';
import createParagraphPlugin from '@sheets-editor/plugin-paragraph';
import createBlockPlugin from '@sheets-editor/plugin-block';
import SlashCommandsPlugin from './SlashCommandsPlugin';
import { MenuItem } from './SlashCommandsPlugin.types';

const content =
  '[{"type":"paragraph","children":[{"id":"4d53fd32-0e66-4547-a62e-33418b4a0804","text":"Sed libero. Fusce pharetra convallis urna. Fusce egestas elit eget lorem. Nam adipiscing. Mauris sollicitudin fermentum libero."}]},{"type":"paragraph","children":[{"text":"Aenean massa. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Donec sodales sagittis magna."}],"id":"4d53fd32-0e26-4657-a64e-33918b4a0804"},{"type":"paragraph","children":[{"text":"Morbi ac felis. Mauris turpis nunc, blandit et, volutpat molestie, porta ut, ligula. Aenean ut eros et nisl sagittis vestibulum. Nunc interdum lacus sit amet orci. Nullam quis ante."}],"id":"ea3b4606-110f-4d6b-91b8-d7d0d32b9d5a"},{"type":"paragraph","children":[{"text":"Nulla facilisi. Quisque id odio. Nullam sagittis. Aenean viverra rhoncus pede. Quisque ut nisi."}],"id":"09507fd5-610d-4800-b7fc-b30b19fe3085"},{"type":"paragraph","children":[{"text":"Ut tincidunt tincidunt erat. Nullam sagittis. Vestibulum volutpat pretium libero. Nulla porta dolor. Mauris turpis nunc, blandit et, volutpat molestie, porta ut, ligula."}],"id":"3baea918-ee0a-43a0-bda8-6329a81feb26"},{"type":"paragraph","children":[{"text":"Vivamus consectetuer hendrerit lacus. Pellentesque auctor neque nec urna. Praesent congue erat at massa. In auctor lobortis lacus. Cras ultricies mi eu turpis hendrerit fringilla."}],"id":"ebc7cc70-5f56-480b-b7be-a6a8ede8273c"},{"type":"paragraph","children":[{"text":"In hac habitasse platea dictumst. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In turpis. Quisque malesuada placerat nisl. In hac habitasse platea dictumst."}],"id":"528429dd-e905-41f1-bc91-e624e9cb1b43"},{"type":"paragraph","children":[{"text":"Praesent porttitor, nulla vitae posuere iaculis, arcu nisl dignissim dolor, a pretium mi sem ut ipsum. Suspendisse feugiat. Sed hendrerit. Praesent adipiscing. Phasellus accumsan cursus velit."}],"id":"aa4f70f8-1541-45f3-a5c7-e130f61ee817"},{"type":"paragraph","children":[{"text":"Phasellus magna. Praesent turpis. Quisque ut nisi. Nunc nulla. Cras risus ipsum, faucibus ut, ullamcorper id, varius ac, leo."}],"id":"407b1078-1657-4b84-baa3-8512edb7a1bb"},{"type":"paragraph","children":[{"text":"Curabitur ullamcorper ultricies nisi. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Cras ultricies mi eu turpis hendrerit fringilla. Quisque rutrum. Phasellus tempus."}],"id":"45f0845e-9af9-4837-a549-be4090327003"}]';

export default { title: 'Plugins|SlashCommands' };

const HeadingPlugin = createHeadingPlugin();
const OLPlugin = createOLPlugin();
const ULPlugin = createULPlugin();
const CodePlugin = createCodePlugin();
const EquationPlugin = createEquationPlugin();
const ParagraphPlugin = createParagraphPlugin();
const BlockPlugin = createBlockPlugin();

const menuItems: MenuItem[] = [
  {
    id: 'paragraph',
    group: 'Basic Blocks',
    title: 'Text',
    subtitle: 'Just start writing with plain text.',
    keywords: 'text,paragraph,plain',
    index: 0,
  },
  {
    id: 'h1',
    group: 'Basic Blocks',
    title: 'Heading 1',
    subtitle: 'Big section heading.',
    keywords: 'h1,one',
    index: 1,
  },
  {
    id: 'h2',
    group: 'Basic Blocks',
    title: 'Heading 2',
    subtitle: 'Medium section heading.',
    keywords: 'h2,two',
    index: 2,
  },
  {
    id: 'h3',
    group: 'Basic Blocks',
    title: 'Heading 3',
    subtitle: 'Small section heading.',
    keywords: 'h3,three',
    index: 3,
  },
  {
    id: 'ul',
    group: 'Basic Blocks',
    title: 'Bulleted list',
    subtitle: 'Create a simple bulleted list.',
    keywords: 'ul',
    index: 4,
  },
  {
    id: 'ol',
    group: 'Basic Blocks',
    title: 'Numbered list',
    subtitle: 'Create a list with numbering.',
    keywords: 'ul',
    index: 5,
  },
  {
    id: 'equation',
    group: 'Basic Blocks',
    title: 'Block equation',
    subtitle: 'Display a standalone math equation.',
    keywords: 'equation',
    index: 6,
  },
  {
    id: 'equation-inline',
    group: 'Basic Blocks',
    title: 'Inline equation',
    subtitle: 'Insert mathematical symbols in text',
    keywords: 'equation,tex,math',
    index: 7,
    inline: true,
  },
  {
    id: 'code',
    group: 'Basic Blocks',
    title: 'Code',
    subtitle: 'Capture a code snippet.',
    keywords: 'code',
    index: 8,
  },
];

const SlashCommands = SlashCommandsPlugin({ menuItems });
const CustomSlashCommands = SlashCommandsPlugin({ menuItems });

export const WithSlashCommandsPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>(JSON.parse(content));

  // console.log(value);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[
        HeadingPlugin,
        OLPlugin,
        ULPlugin,
        EquationPlugin,
        CodePlugin,
        SlashCommands,
        ParagraphPlugin,
        BlockPlugin,
      ]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};

export const WithCustomisedSlashCommandsPlugin: React.FC = () => {
  const [value, setValue] = useState<Node[]>([
    {
      type: 'text',
      children: [
        { text: 'I use the SlashCommandsPlugin with custom options.' },
      ],
    },
  ]);

  return (
    <Editor
      components={components}
      value={value}
      plugins={[CustomSlashCommands]}
      onChange={(newValue): void => {
        setValue(newValue);
      }}
    />
  );
};
