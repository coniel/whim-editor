import React from 'react';
import { Range, NodeEntry, Node } from 'slate';
import { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react';

export interface SlashEditor extends ReactEditor {
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  decorate: (entry: NodeEntry<Node>) => Range[];
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void | undefined;
}

export interface SlashPlugin {
  renderElement?: (props: RenderElementProps) => JSX.Element | undefined;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element | undefined;
  decorate?: (entry: NodeEntry<Node>) => Range[] | undefined;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void | undefined;
}

export type SlashPluginFactory = (editor: SlashEditor) => SlashPlugin;

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
  plugins: SlashPluginFactory[],
): SlashEditor => {
  editor.onKeyDown = (): void => undefined;
  editor.renderElement = (props: RenderElementProps): JSX.Element =>
    renderElement(props);
  editor.renderLeaf = (props: RenderLeafProps): JSX.Element =>
    renderLeaf(props);
  editor.decorate = (): Range[] => [];

  return plugins.reduce((slashEditor: SlashEditor, pluginFn): SlashEditor => {
    const { renderElement, renderLeaf, onKeyDown, decorate } = slashEditor;
    const plugin = pluginFn(slashEditor);

    slashEditor.renderElement = (props): JSX.Element => {
      if (plugin.renderElement) {
        return plugin.renderElement(props) || renderElement(props);
      }

      return renderElement(props);
    };

    slashEditor.renderLeaf = (props): JSX.Element => {
      if (plugin.renderLeaf) {
        const children = plugin.renderLeaf(props);

        if (children) {
          return renderLeaf({ ...props, children });
        }
      }

      return renderLeaf(props);
    };

    slashEditor.onKeyDown = (event): void => {
      if (plugin.onKeyDown) {
        plugin.onKeyDown(event);
      }
      onKeyDown(event);
    };

    slashEditor.decorate = (props): Range[] => {
      if (plugin.decorate) {
        return plugin.decorate(props) || decorate(props);
      }

      return decorate(props);
    };

    return slashEditor;
  }, editor as SlashEditor);
};

export default withPlugins;
