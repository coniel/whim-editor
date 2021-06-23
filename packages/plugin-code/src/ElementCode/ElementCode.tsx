import React, { useRef, useState, useCallback } from 'react';
import { RenderElementProps, useUI } from '@braindrop-editor/core';
import { DropdownIcon } from './DropdownIcon';
import { CodeElement } from '../CodePlugin.types';

export interface ElementCodeProps extends RenderElementProps {
  onSetLanguage: (element: CodeElement, language: string) => void;
  element: CodeElement;
}

interface Language {
  value: string;
  label: string;
}

const languages: Language[] = [
  { value: 'abap', label: 'ABAP' },
  // { value: 'arduino', label: 'Arduino' },
  { value: 'bash', label: 'Bash' },
  { value: 'basic', label: 'BASIC' },
  { value: 'c', label: 'C' },
  { value: 'clojure', label: 'Clojure' },
  { value: 'coffeescript', label: 'CoffeeScript' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'css', label: 'CSS' },
  { value: 'dart', label: 'Dart' },
  { value: 'docker', label: 'Docker' },
  { value: 'elixir', label: 'Elixir' },
  { value: 'elm', label: 'Elm' },
  { value: 'erlang', label: 'Erlang' },
  { value: 'flow', label: 'Flow' },
  { value: 'fortran', label: 'Fortran' },
  { value: 'fsharp', label: 'F#' },
  { value: 'gherkin', label: 'Gherkin' },
  { value: 'glsl', label: 'GLSL' },
  { value: 'go', label: 'Go' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'groovy', label: 'Groovy' },
  // { value: 'haskel', label: 'Haskel' },
  { value: 'html', label: 'HTML' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'Javascript' },
  { value: 'json', label: 'JSON' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'latex', label: 'LaTeX' },
  { value: 'less', label: 'Less' },
  { value: 'lisp', label: 'Lisp' },
  { value: 'livescript', label: 'Livescript' },
  { value: 'makefile', label: 'Makefile' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'markup', label: 'Markup' },
  { value: 'nix', label: 'Nix' },
  { value: 'objectivec', label: 'Objective-C' },
  { value: 'ocaml', label: 'OCaml' },
  { value: 'pascal', label: 'Pascal' },
  { value: 'perl', label: 'Perl' },
  { value: 'php', label: 'PHP' },
  { value: 'powershell', label: 'PowerShell' },
  { value: 'prolog', label: 'Prolog' },
  { value: 'python', label: 'Python' },
  { value: 'r', label: 'R' },
  { value: 'reason', label: 'Reason' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'rust', label: 'Rust' },
  { value: 'sass', label: 'Sass' },
  { value: 'scala', label: 'Scheme' },
  { value: 'scss', label: 'Scss' },
  { value: 'shell', label: 'Shell' },
  { value: 'sql', label: 'SQL' },
  { value: 'swift', label: 'Swift' },
  { value: 'typescript', label: 'Typescript' },
  { value: 'vbnet', label: 'VB.Net' },
  { value: 'verilog', label: 'Verilog' },
  { value: 'vhdl', label: 'VHDL' },
  { value: 'visual-basic', label: 'Visual Basic' },
  { value: 'wasm', label: 'WebAssembly' },
  { value: 'xml-doc', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
];

export const ElementCode: React.FC<ElementCodeProps> = ({
  attributes,
  children,
  element,
  onSetLanguage,
}) => {
  const { Button, Popover, List, MenuItem, TextField } = useUI();
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);
  const [language, setLanguage] = useState(element.properties.language);
  const selectedLanguage = languages.find(({ value }) => value === language);

  let label = 'Unknown';

  if (selectedLanguage) {
    label = selectedLanguage.label;
  }

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setFilter(event.target.value);
    },
    [],
  );

  const handleClose = useCallback((): void => {
    setSelectOpen(false);
    setTimeout(() => {
      setFilter('');
    }, 1000);
  }, []);

  const handleClickOption = useCallback(
    (value: string): void => {
      setLanguage(value);
      onSetLanguage(element, value);
      handleClose();
    },
    [handleClose, onSetLanguage],
  );

  return (
    <div
      style={{
        margin: '8px 0',
        borderRadius: 3,
        backgroundColor: '#F7F6F3',
        position: 'relative',
      }}
    >
      <code
        {...attributes}
        style={{
          display: 'block',
          fontSize: '14px',
          lineHeight: '20px',
          padding: '32px 16px',
          fontFamily:
            'SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace',
        }}
      >
        {children}
      </code>
      <div
        contentEditable={false}
        style={{ position: 'absolute', bottom: 8, right: 8 }}
        ref={buttonContainerRef}
      >
        <Button
          style={{ border: 0, color: '#757575' }}
          onClick={(): void => setSelectOpen(true)}
          endIcon={<DropdownIcon />}
        >
          {label}
        </Button>
        <Popover
          open={selectOpen}
          anchorEl={buttonContainerRef.current}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div style={{ maxHeight: 300, position: 'relative' }}>
            <div
              style={{
                padding: 14,
                backgroundColor: '#FFF',
              }}
            >
              <TextField
                autoFocus
                onChange={handleSearch}
                style={{ width: '100%' }}
                placeholder="Search for a language"
              />
            </div>
            <List
              style={{
                maxHeight: 230,
                overflowY: 'scroll',
              }}
            >
              {languages
                .filter((lang) =>
                  lang.label.toLocaleLowerCase().includes(filter.toLowerCase()),
                )
                .map((lang) => (
                  <MenuItem
                    key={lang.value}
                    onClick={(): void => handleClickOption(lang.value)}
                  >
                    {lang.label}
                  </MenuItem>
                ))}
            </List>
          </div>
        </Popover>
      </div>
    </div>
  );
};
