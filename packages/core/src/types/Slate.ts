import {
  BaseEditor,
  BaseElement,
  NodeEntry,
  BaseRange,
  Path,
  BaseNode,
} from 'slate';
import {
  ReactEditor,
  RenderElementProps as SlateReactRenderElementProps,
  RenderLeafProps,
} from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { EditableProps } from 'slate-react/dist/components/editable';

export interface Element extends BaseElement {
  type: string;
  id?: string;
}

export interface RenderElementProps extends SlateReactRenderElementProps {
  element: Element;
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
