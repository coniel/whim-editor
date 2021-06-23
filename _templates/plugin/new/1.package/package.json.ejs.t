---
to: packages/<%= package %>/package.json
---
{
  "name": "@braindrop-editor/<%= package %>",
  "version": "0.0.1",
  "description": "<%= description %>",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/coniel/slash.git"
  },
  "dependencies": {
    "@braindrop-editor/core": "^0.20.0"
  },
  "peerDependencies": {
    "react": "^16.9.0",
    "slate": "^0.63.0",
    "slate-react": "^0.65.2"
  },
  "devDependencies": {
    "@braindrop-editor/material-ui": "0.6.0"
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
