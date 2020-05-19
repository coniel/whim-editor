import React from 'react';
import { Range, NodeEntry, Node } from 'slate';
import { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react';

export interface SlashEditor extends ReactEditor {
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  decorate: (entry: NodeEntry<Node>) => Range[];
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void | undefined;
}

export type SlashPlugin = (editor: SlashEditor) => SlashEditor;

export const Element: React.FC<RenderElementProps> = ({
  attributes,
  children,
}) => <div {...attributes}>{children}</div>;

export const Leaf: React.FC<RenderLeafProps> = ({ attributes, children }) => (
  <span {...attributes}>{children}</span>
);

function renderElement(props: RenderElementProps): JSX.Element {
  return <Element {...props} />;
}

function renderLeaf(props: RenderLeafProps): JSX.Element {
  return <Leaf {...props} />;
}

const withPlugins = (
  editor: ReactEditor,
  plugins: SlashPlugin[],
): SlashEditor => {
  editor.onKeyDown = (): void => undefined;
  editor.renderElement = (props: RenderElementProps): JSX.Element =>
    renderElement(props);
  editor.renderLeaf = (props: RenderLeafProps): JSX.Element =>
    renderLeaf(props);
  editor.decorate = (): Range[] => [];

  return plugins.reduce((slashEditor, plugin) => {
    return plugin(slashEditor);
  }, editor as SlashEditor);
};

export default withPlugins;
