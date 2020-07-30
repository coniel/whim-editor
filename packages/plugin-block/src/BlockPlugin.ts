import { SlashPluginFactory, SlashPlugin, SlashEditor } from '@slash/editor';
import renderElementBlock from './renderElementBlock';

export interface BlockPluginOptions {
  foo?: string;
}

const BlockPlugin = (options: BlockPluginOptions = {}): SlashPluginFactory => (
  editor: SlashEditor,
): SlashPlugin => ({
  renderElement: (props): JSX.Element | undefined => renderElementBlock(props),
});

export default BlockPlugin;
