---
to: packages/<%= package %>/package.json
---
{
  "name": "@sheets-editor/<%= package %>",
  "version": "0.0.1",
  "description": "<%= description %>",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/coniel/slash.git"
  },
  "peerDependencies": {
    "@sheets-editor/core": "^0.5.0",
    "react": "^16.9.0",
    "slate": "^0.58.1",
    "slate-react": "^0.58.1"
  },
  "devDependencies": {
    "@sheets-editor/material-ui": "0.6.0"
  },
  "scripts": {
    "build:declaration": "tsc --project tsconfig.build.json",
    "build:es": "BABEL_ENV=build babel src --root-mode upward --out-dir dist --source-maps --extensions .ts,.tsx --delete-dir-on-start --no-comments"
  },
  "files": [
    "dist"
  ]
}
