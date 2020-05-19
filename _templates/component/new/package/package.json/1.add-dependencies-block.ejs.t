---
inject: true
to: "<%= locals.styled ? `packages/${package}/package.json` : null %>"
before: peerDependencies
skip_if: "dependencies"
---
  "dependencies": {
    "clsx": "^1.0.4",
    "prop-types": "^15.7.2"
  },