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
