/* eslint-disable global-require, no-underscore-dangle, import/no-dynamic-require */

const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

const rootPath = process.cwd();

// Some packages make use of this constant
global.__DEV__ = true;

// Attempt to require each file to see if imports are broken
glob.sync('./packages/*/').forEach((packagePath) => {
  console.log(`Verifying ${path.basename(packagePath)}`);

  glob.sync(`${packagePath}/{*.js,lib/*.js}`).forEach((filePath) => {
    const fileName = path.basename(filePath);
    const absPath = path.resolve(__dirname, '..', filePath);

    console.log(`\t${fileName}`);

    // Change directories to utilize lerna linked modules
    try {
      process.chdir(path.dirname(absPath));

      const module = require(absPath);

      // We need to make sure the correct default export exists
      if ((fileName === 'index.js' || fileName === 'unified.js') && module && module.default) {
        console.log(module);

        throw new Error('Invalid default export.');
      }
    } catch (error) {
      console.log(chalk.red(`\t\tERROR: ${error.message}`));
    }

    process.chdir(rootPath);
  });
});
