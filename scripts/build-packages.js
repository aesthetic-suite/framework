/* eslint-disable comma-dangle, no-console */

const fs = require('fs');
const fsp = require('fs-promise');
const path = require('path');
const glob = require('glob');
const babel = require('babel-core');

// For some reason babel-core won't find the config, so load it manually
const babelConfig = Object.assign({}, JSON.parse(fs.readFileSync('.babelrc', 'utf8')), {
  shouldPrintComment: () => false,
  comments: false,
  ast: false,
});

// List of packages and their build configuration
const packages = {
  aesthetic: 'src/*.js',
  'aesthetic-adapter-aphrodite': 'src/adapters/aphrodite/*.js',
  'aesthetic-adapter-css-modules': 'src/adapters/css-modules/*.js',
  'aesthetic-adapter-fela': 'src/adapters/fela/*.js',
  'aesthetic-adapter-glamor': 'src/adapters/glamor/*.js',
  'aesthetic-adapter-jss': 'src/adapters/jss/*.js',
  'aesthetic-native': 'src/native/*.js',
  'aesthetic-utils': 'src/utils/*.js',
};

// Imports that we should replace to support our module system
const imports = {
  aesthetic: ['Adapter', 'Aesthetic'],
  'aesthetic/unified': ['UnifiedSyntax'],
  'aesthetic-utils': [
    'createStyleElement', 'isObject', 'isPrimitive', 'toArray',
    'injectAtRules', 'injectFallbacks', 'injectRuleByLookup',
  ],
};

// Use default exports over named exports
const defaultImports = {
  Aesthetic: true,
  UnifiedSyntax: true,
};

function replaceImports(source, filePath, currentPackage) {
  Object.keys(imports).forEach((packageName) => {
    if (
      currentPackage === packageName ||
      filePath.includes('index.js') ||
      filePath.includes('unified.js')
    ) {
      return;
    }

    imports[packageName].forEach((name) => {
      source = source.replace(new RegExp(`import ${name} from '[./a-z]+/${name}';`, 'ig'), () => {
        if (defaultImports[name]) {
          return `import ${name} from '${packageName}';`;
        }

        return `import { ${name} } from '${packageName}';`;
      });
    });
  });

  return source;
}

Object.keys(packages).forEach((packageName) => {
  const libFiles = packages[packageName];
  const libPath = `packages/${packageName}/`;

  Promise.all(
    glob.sync(libFiles).map(filePath => (
      fsp.stat(libPath)
        .then(stats => (stats.isDirectory() ? stats : fsp.mkdir(libPath)))
        .then(stats => fsp.readFile(filePath, 'utf8'))
        .then(source => replaceImports(source.toString('utf8'), filePath, packageName))
        .then(source => babel.transform(source, babelConfig).code)
        .then(source => fsp.writeFile(`${libPath}/${path.basename(filePath)}`, source, 'utf8'))
    ))
  ).then(() => {
    console.log(`Built ${packageName}`);
  }).catch((error) => {
    console.log(error);
    process.exitCode = 1;
  });
});
