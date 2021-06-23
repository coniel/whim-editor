import { BaseEditor, NodeEntry, BaseRange, Path, BaseNode } from 'slate';
import {
  ReactEditor,
  RenderElementProps as SlateReactRenderElementProps,
  RenderLeafProps,
} from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { EditableProps as BaseEditableProps } from 'slate-react/dist/components/editable';
import { Element as BaseElement } from './Element.types';

// eslint-disable-next-line @typescript-eslint/ban-types
type Element = BaseElement<string, {}>;

type RenderElementAttributes = SlateReactRenderElementProps['attributes'] & {
  'data-block-id': string;
};

interface RenderElementProps extends SlateReactRenderElementProps {
  element: Element;
  attributes: RenderElementAttributes;
}

export interface EditableProps
  extends Omit<BaseEditableProps, 'renderElement'> {
  renderElement: (props: RenderElementProps) => JSX.Element;
}

export interface InsertOptions {
  at?: Path;
}

export interface TurnIntoOptions {
  at?: Path;
}

export interface BraindropEditor
  extends Omit<BaseEditor, 'children'>,
    ReactEditor,
    HistoryEditor {
  children: Element[];
  generateBlockId: () => string;
  renderEditable: (props: EditableProps) => JSX.Element;
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  decorate: (entry: NodeEntry<BaseNode>) => BaseRange[];
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void | true;
  onDOMBeforeInput: (event: Event) => void;
  deleteElement: (element: Element) => void;
  insertElement: (type: string, options?: InsertOptions) => void;
  turnIntoElement: (
    type: string,
    element: Element,
    options?: TurnIntoOptions,
  ) => void;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BraindropEditor;
    Element: Element;
    Range: BaseRange;
    Ancestor: Element | BraindropEditor;
  }
}
