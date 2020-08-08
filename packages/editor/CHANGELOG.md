# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.5.0 (2020-08-08)


### Bug Fixes

* **editor:** bump package version ([8b60843](https://github.com/coniel/slash/commit/8b60843efe12130bb6847a373a2206e78c396e3f))
* **editor:** changelog file type ([4a5fe71](https://github.com/coniel/slash/commit/4a5fe71cff02cab084b8643d0d7521990d62d64d))


### Features

* **editor:** add ability to customize rendering of Editable in plugins ([4258c63](https://github.com/coniel/slash/commit/4258c63692f8e8512c665290c8d7c1c22957ccbc))
* add HTML deserializers ([0ea9791](https://github.com/coniel/slash/commit/0ea9791543d88eb974679a65dba2ea833196aa5e))
* create basic editor which accepts plugins ([95dd7f4](https://github.com/coniel/slash/commit/95dd7f4b89b2cb9e6cdfe5e581cfddb8050df7a2))
* create UIProvider ([57c7d42](https://github.com/coniel/slash/commit/57c7d42a5b2b3d4be8b424f99cdf00d4d36d89d4))
* create useSoftReturn and useHardReturn utils ([e18aa60](https://github.com/coniel/slash/commit/e18aa60c89d38ce3c35a562268273f9069f605c4))
* **editor:** Add elements and leaves interface to plugins ([1a829e6](https://github.com/coniel/slash/commit/1a829e688a7e89b2b31579cfedde0bb5da91acf9))





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
