# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.4](https://github.com/coniel/slash/compare/@sheets-editor/editor@0.4.3...@sheets-editor/editor@0.4.4) (2020-08-08)

**Note:** Version bump only for package @sheets-editor/editor

## [0.4.3](https://github.com/coniel/slash/compare/@sheets-editor/editor@0.4.2...@sheets-editor/editor@0.4.3) (2020-08-08)

**Note:** Version bump only for package @sheets-editor/editor

## [0.4.2](https://github.com/coniel/slash/compare/@sheets-editor/editor@0.4.1...@sheets-editor/editor@0.4.2) (2020-08-08)

### Reverts

- Revert "Publish" ([765384d](https://github.com/coniel/slash/commit/765384d2f7a4d1f6df4562ddfc9cb3ccaaeee61e))
- Revert "Publish" ([bdb73d3](https://github.com/coniel/slash/commit/bdb73d31c43a8ebc098e98d9302e068969436d1d))

## [0.4.1](https://github.com/coniel/slash/compare/@sheets-editor/editor@0.4.1...@sheets-editor/editor@0.4.1) (2020-08-08)

### Reverts

- Revert "Publish" ([765384d](https://github.com/coniel/slash/commit/765384d2f7a4d1f6df4562ddfc9cb3ccaaeee61e))
- Revert "Publish" ([bdb73d3](https://github.com/coniel/slash/commit/bdb73d31c43a8ebc098e98d9302e068969436d1d))

# Change Log

This is a list of changes to Slash with each new release. Until 1.0.0 is released, breaking changes will be added as minor or patch version bumps.

### `0.4.0` — July 30, 2020

###### NEW

- Add `useUI` hook for accessing UI components provided by the editor
- Add `useSoftBreak` and `useHardBreak` utilities

###### BREAKING CHANGE

- Use `turnInto` instead of `insert` when applying a block shortcut

### `0.3.0` — July 20, 2020

###### NEW

- Add `elementDeserializers` interface to `SlashPlugin` for quickly defining a plugin's element deserializers
- Add `markDeserializers` interface to `SlashPlugin` for quickly defining a plugin's mark deserializers

### `0.2.0` — May 28, 2020

###### NEW

- Add `elements` interface to `SlashPlugin` which allows passing in an array of `SlashPluginElementDescriptor` for quickly defining a plugin's elements
- Add `leaves` interface to `SlashPlugin` which allows passing in an array of `SlashPluginLeafDescriptor` for quickly defining a plugin's leaves

### `0.1.0` — May 20, 2020

###### BREAKING CHANGE

- Remodel plugins API to return SlashPlugin object instead of editor
- Render children above editor (inside Slate provider)

### `0.0.1` — May 19, 2020

###### NEW

- Create basic editor which accepts plugins
