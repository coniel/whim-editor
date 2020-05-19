---
inject: true
to: "<%= locals.styled ? `packages/${package}/package.json` : null %>"
after: clsx
skip_if: prop-types
---
    "prop-types": "^15.7.2",