/* eslint-disable global-require, import/no-dynamic-require */

const path = require('path');
const glob = require('glob');

const rootPath = process.cwd();

// Attempt to require each file to see if imports are broken
glob.sync('./packages/*/').forEach((packagePath) => {
  console.log(`Verifying ${path.basename(packagePath)}`);

  try {
    glob.sync(`${packagePath}/{*.js,lib/*.js}`).forEach((filePath) => {
      console.log(`\t${path.basename(filePath)}`);

      const absPath = path.resolve(__dirname, '..', filePath);

      // Change directories to utilize lerna linked modules
      process.chdir(path.dirname(absPath));
      require(absPath);
      process.chdir(rootPath);
    });
  } catch (error) {
    console.log(`\tERROR: ${error.message}`);
    process.chdir(rootPath);
  }
});
