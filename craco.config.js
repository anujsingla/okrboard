const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@rh-support/components': path.resolve(__dirname, 'node_modules/@rh-support/components'),
      '@patternfly/react-core': path.resolve(__dirname, 'node_modules/@patternfly/react-core')
    }
  }
};
