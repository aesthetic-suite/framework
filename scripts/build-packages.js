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
  aesthetic: {
    files: 'src/*.js',
  },
  'aesthetic-adapter-aphrodite': {
    files: 'src/adapters/aphrodite/*.js',
  },
  'aesthetic-adapter-css-modules': {
    files: 'src/adapters/css-modules/*.js',
  },
  'aesthetic-adapter-fela': {
    files: 'src/adapters/fela/*.js',
  },
  'aesthetic-adapter-glamor': {
    files: 'src/adapters/glamor/*.js',
  },
  'aesthetic-adapter-jss': {
    files: 'src/adapters/jss/*.js',
  },
  'aesthetic-utils': {
    files: 'src/utils/*.js',
  },
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
    if (currentPackage === packageName || filePath.includes('index.js')) {
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
  const libPackage = packages[packageName];
  const libPath = `packages/${packageName}/`;

  Promise.all(
    glob.sync(libPackage.files).map(filePath => (
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
    process.exit(0);
  });
});
