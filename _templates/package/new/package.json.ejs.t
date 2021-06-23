---
to: packages/<%= name %>/package.json
---
{
  "name": "@braindrop-editor/<%= h.changeCase.paramCase(name) %>",
  "version": "0.0.1",
  "description": "<%= desc %>",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/coniel/slash.git"
  },
  "peerDependencies": {
    "react": "^16.9.0"
  },
  "scripts": {
    "build:declaration": "tsc --project tsconfig.build.json",
    "build:es": "BABEL_ENV=build babel src --root-mode upward --out-dir dist --source-maps --extensions .ts,.tsx --delete-dir-on-start --no-comments"
  },
  "publishConfig": {
    "access": "public"
  },
  "files": [
    "dist"
  ]
}
