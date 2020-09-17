# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.10.0](https://github.com/coniel/slash/compare/v0.9.0...v0.10.0) (2020-09-17)


### Bug Fixes

* **core:** fix withPlugins insertData overwriting plugin insertData ([8c931af](https://github.com/coniel/slash/commit/8c931af3519c759aa7a417488f4ede44422340bf))


### Features

* **core:** add backspace out behaviour ([ede3a66](https://github.com/coniel/slash/commit/ede3a661c87d18cf4794c54f3bf8c8c87e71c517))
* **core:** add EditorStateProvider allowing global editor state within react components ([ba96fa5](https://github.com/coniel/slash/commit/ba96fa57eb9c8465c79b1a961cc2a67e8e1e8a50))





# [0.9.0](https://github.com/coniel/slash/compare/v0.8.1...v0.9.0) (2020-08-31)


### Bug Fixes

* remove mark on carret when using mark shortcut ([30cfa01](https://github.com/coniel/slash/commit/30cfa01c1371ec4c9b87d83f2e7eac7722ff8103))


### Features

* add 'soft-break' as as option for block return bheaviour ([d3fd029](https://github.com/coniel/slash/commit/d3fd0296c29369ad8749eae5414f698e838979ce))
* add new UI components ([4078125](https://github.com/coniel/slash/commit/4078125192d15854fd657346dfe44c4778230c90))





## [0.8.1](https://github.com/coniel/slash/compare/v0.8.0...v0.8.1) (2020-08-26)


### Bug Fixes

* **plugin-link:** make package public ([50d006e](https://github.com/coniel/slash/commit/50d006e79f0c7cb6a8a19d4f732c2eedf0fe5e48))





# [0.8.0](https://github.com/coniel/slash/compare/v0.7.1...v0.8.0) (2020-08-26)

**Note:** Version bump only for package @sheets-editor/core





## [0.7.1](https://github.com/coniel/slash/compare/v0.7.0...v0.7.1) (2020-08-25)


### Bug Fixes

* make new packages public ([eadc1c1](https://github.com/coniel/slash/commit/eadc1c10f9760f8c58f9a094fd578c88704b9453))





# 0.7.0 (2020-08-25)


### Features

* create plugin-ordered-list ([3bb1f22](https://github.com/coniel/slash/commit/3bb1f22adcbc54e63317dff99a1706ba532d1d03))
* **core:** add option to define return behaviour for elements ([67ee557](https://github.com/coniel/slash/commit/67ee557d3e4d3657dab7ea9afb0c2ee62801aed3))





## 0.5.1 (2020-08-08)

**Note:** Version bump only for package @sheets-editor/core





## [0.4.4](https://github.com/coniel/slash/compare/@sheets-editor/core@0.4.3...@sheets-editor/core@0.4.4) (2020-08-08)

**Note:** Version bump only for package @sheets-editor/core

## [0.4.3](https://github.com/coniel/slash/compare/@sheets-editor/core@0.4.2...@sheets-editor/core@0.4.3) (2020-08-08)

**Note:** Version bump only for package @sheets-editor/core

## [0.4.2](https://github.com/coniel/slash/compare/@sheets-editor/core@0.4.1...@sheets-editor/core@0.4.2) (2020-08-08)

### Reverts

- Revert "Publish" ([765384d](https://github.com/coniel/slash/commit/765384d2f7a4d1f6df4562ddfc9cb3ccaaeee61e))
- Revert "Publish" ([bdb73d3](https://github.com/coniel/slash/commit/bdb73d31c43a8ebc098e98d9302e068969436d1d))

## [0.4.1](https://github.com/coniel/slash/compare/@sheets-editor/core@0.4.1...@sheets-editor/core@0.4.1) (2020-08-08)

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
