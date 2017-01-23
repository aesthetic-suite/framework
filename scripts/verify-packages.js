/* eslint-disable global-require, import/no-dynamic-require */

const path = require('path');
const glob = require('glob');

// Attempt to require each file to see if imports are broken
glob.sync('./packages/*').forEach((packagePath) => {
  console.log(`Verifying ${path.basename(packagePath)}`);

  try {
    glob.sync(`${packagePath}/*.js`).forEach((filePath) => {
      const absPath = path.resolve(__dirname, '..', filePath);

      process.chdir(path.dirname(absPath));
      require(absPath);
    });
  } catch (error) {
    console.log(error);
    process.exitCode = 1;
  }
});
