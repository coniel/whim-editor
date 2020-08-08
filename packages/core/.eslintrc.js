const { join } = require('path');

module.exports = {
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      // Fix for missing dependency error in story files.
      // Use package.json from both this package folder and root.
      { packageDir: [__dirname, join(__dirname, '../../')] },
    ],
  },
};
