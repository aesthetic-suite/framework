/* eslint-disable comma-dangle, no-console */

const fs = require('fs');
const fsp = require('fs-promise');
const path = require('path');
const glob = require('glob');
const babel = require('babel-core');

// For some reason babel-core won't find the config, so load it manually
const babelConfig = Object.assign({}, JSON.parse(fs.readFileSync('package.json', 'utf8')).babel);

// List of packages to build
const packages = [
  'aesthetic',
  'aesthetic-adapter-aphrodite',
  'aesthetic-adapter-css-modules',
  'aesthetic-adapter-fela',
  'aesthetic-adapter-glamor',
  'aesthetic-adapter-jss',
  'aesthetic-native',
  'aesthetic-utils',
];

// Replace relative imports with absolute NPM imports
function replaceImports(source, filePath, currentPackage) {
  return source.replace(/(?:\.\.\/)+(aesthetic(?:[-a-z]+)?)\/src/g, (match, nextPackage) => (
    `${nextPackage}/lib`
  ));
}

packages.forEach((packageName) => {
  const basePath = path.join(process.cwd(), 'packages', packageName);
  const srcFiles = `${basePath}/src/*.js`;
  const libPath = `${basePath}/lib`;

  // Create lib folder
  try {
    fs.mkdirSync(libPath);
  } catch (e) {
    // Exists
  }

  // Transpile src files
  Promise.all(
    glob.sync(srcFiles).map(filePath => (
      fsp.readFile(filePath, 'utf8')
        .then(source => replaceImports(source.toString('utf8'), filePath, packageName))
        .then(source => babel.transform(source, babelConfig).code)
        .then(source => fsp.writeFile(`${libPath}/${path.basename(filePath)}`, source, 'utf8'))
    ))
  ).then(() => {
    console.log(`Built ${packageName}`);
  }).catch((error) => {
    console.log(error);
    process.exit(1);
  });
});
