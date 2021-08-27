import Prism, { Token } from 'prismjs';
import 'prismjs/components/prism-abap';
// import 'prismjs/components/prism-arduino';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-basic';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-clojure';
import 'prismjs/components/prism-coffeescript';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-elixir';
import 'prismjs/components/prism-elm';
import 'prismjs/components/prism-erlang';
import 'prismjs/components/prism-flow';
import 'prismjs/components/prism-fortran';
import 'prismjs/components/prism-fsharp';
import 'prismjs/components/prism-gherkin';
import 'prismjs/components/prism-glsl';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-groovy';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-latex';
import 'prismjs/components/prism-less';
import 'prismjs/components/prism-lisp';
import 'prismjs/components/prism-livescript';
import 'prismjs/components/prism-makefile';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-nix';
import 'prismjs/components/prism-objectivec';
import 'prismjs/components/prism-ocaml';
import 'prismjs/components/prism-pascal';
import 'prismjs/components/prism-perl';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-prolog';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-r';
import 'prismjs/components/prism-reason';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scheme';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-vbnet';
import 'prismjs/components/prism-verilog';
import 'prismjs/components/prism-vhdl';
import 'prismjs/components/prism-visual-basic';
import 'prismjs/components/prism-wasm';
import 'prismjs/components/prism-xml-doc';
import 'prismjs/components/prism-yaml';
import { Text, Range, Node, Path } from 'slate';
import {
  getBlockAbove,
  BraindropEditor,
  isNodeType,
} from '@braindrop-editor/core';
import 'prismjs/themes/prism.css';
import { CodeElement, CodeRange } from './CodePlugin.types';

const getLength = (token: string | Token): number => {
  if (typeof token === 'string') {
    return token.length;
  } else if (typeof token.content === 'string') {
    return token.content.length;
  } else {
    return (token.content as (string | Token)[]).reduce(
      (l, t) => l + getLength(t),
      0,
    );
  }
};

// decorate function depends on the language selected
export const createDecorator = (editor: BraindropEditor, type: string) => ([
  node,
  path,
]: [Node, Path]): Range[] => {
  const ranges: CodeRange[] = [];
  if (!Text.isText(node)) {
    return ranges;
  }

  const parent = getBlockAbove(editor, { at: path });

  if (!parent || !isNodeType(parent, { allow: [type] })) {
    return ranges;
  }

  const codeElement = parent[0] as CodeElement;
  const { language } = codeElement;

  const tokens = Prism.tokenize(node.text, Prism.languages[language]);
  let start = 0;

  for (const token of tokens) {
    const length = getLength(token);
    const end = start + length;

    if (typeof token !== 'string') {
      ranges.push({
        decorateCode: true,
        token: token.type,
        anchor: { path, offset: start },
        focus: { path, offset: end },
      });
    }

    start = end;
  }

  return ranges;
};
