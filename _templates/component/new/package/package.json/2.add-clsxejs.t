---
inject: true
to: "<%= locals.styled ? `packages/${package}/package.json` : null %>"
after: dependencies
skip_if: clsx
---
    "clsx": "^1.0.4",