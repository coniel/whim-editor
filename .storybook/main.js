module.exports = {
  // addons: ['@storybook/addon-essentials'],
  typescript: {
    reactDocgen: false,
  },
  stories: [
    '../packages/material-ui/src/**/*.story.tsx',
    '../packages/plugin-block/src/**/*.story.tsx',
    '../packages/plugin-block-api/src/**/*.story.tsx',
    '../packages/plugin-code/src/**/*.story.tsx',
    '../packages/plugin-heading/src/**/*.story.tsx',
    '../packages/plugin-hovering-toolbar/src/**/*.story.tsx',
    '../packages/plugin-link/src/**/*.story.tsx',
    '../packages/plugin-ordered-list/src/**/*.story.tsx',
    '../packages/plugin-rich-text/src/**/*.story.tsx',
    '../packages/plugin-slash-commands/src/**/*.story.tsx',
    '../packages/plugin-unordered-list/src/**/*.story.tsx',
    '../packages/plugin-forced-layout/src/**/*.story.tsx',
    '../packages/plugin-equation/src/**/*.story.tsx',
  ],
};
