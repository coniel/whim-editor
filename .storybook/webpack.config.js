const path = require('path');
const { lstatSync, readdirSync } = require('fs');

const basePath = path.resolve(__dirname, '../', 'packages');
const packages = readdirSync(basePath).filter((name) =>
  lstatSync(path.join(basePath, name)).isDirectory(),
);

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('ts-loader'),
    options: {
      configFile: 'tsconfig.storybook.json',
    },
  });
  config.resolve.extensions.push('.ts', '.tsx');

  Object.assign(config.resolve.alias, {
    ...packages.reduce(
      (acc, name) => ({
        ...acc,
        [`@sheets-editor/${name}`]: path.join(basePath, name, 'src'),
      }),
      {},
    ),
  });

  return config;
};
