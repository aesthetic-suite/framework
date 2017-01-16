/* eslint-disable global-require, import/no-dynamic-require */

const path = require('path');
const glob = require('glob');

// Attempt to require each file to see if imports are broken
glob.sync('./packages/**/{index,unified}.js').forEach((packagePath) => {
  try {
    require(path.join(__dirname, '..', packagePath));
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
});
