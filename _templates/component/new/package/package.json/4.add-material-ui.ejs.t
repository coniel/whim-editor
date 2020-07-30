---
inject: true
to: "<%= locals.styled ? `packages/${package}/package.json` : null %>"
after: peerDependencies
skip_if: material-ui/core
---
    "@material-ui/core": "^5.0.0-alpha.4",