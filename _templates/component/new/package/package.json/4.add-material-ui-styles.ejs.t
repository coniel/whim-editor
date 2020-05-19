---
inject: true
to: "<%= locals.styled ? `packages/${package}/package.json` : null %>"
after: peerDependencies
skip_if: material-ui/styles
---
    "@material-ui/styles": "4.9.14",