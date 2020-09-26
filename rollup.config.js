/* eslint-disable import/no-extraneous-dependencies */

import fs from 'fs';
import path from 'path';
import externals from 'rollup-plugin-node-externals';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

const babelConfig = require('./babel.config');

// Order is imporant!
const packages = [
  'types',
  'utils',
  'system',
  'style',
  'sss',
  'addon-direction',
  'addon-mixins',
  'addon-properties',
  'addon-vendor',
  'core',
];
const targets = [];

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const webPlugins = [
  resolve({ extensions }),
  babel({
    ...babelConfig,
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    extensions,
  }),
];
const nodePlugins = [
  resolve({ extensions }),
  babel({
    ...babelConfig,
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    extensions,
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          modules: false,
          shippedProposals: true,
          targets: { node: '10.10' },
        },
      ],
      '@babel/preset-typescript',
    ],
  }),
];

packages.forEach((pkg) => {
  targets.push({
    input: `packages/${pkg}/src/index.ts`,
    output: [
      {
        exports: 'auto',
        file: `packages/${pkg}/lib/index.js`,
        format: 'cjs',
      },
      {
        exports: 'auto',
        file: `packages/${pkg}/esm/index.js`,
        format: 'esm',
      },
    ],
    plugins: [
      externals({
        deps: true,
        packagePath: path.resolve(`packages/${pkg}/package.json`),
      }),
      ...webPlugins,
    ],
  });

  if (pkg === 'style') {
    targets.push({
      input: `packages/${pkg}/src/server.ts`,
      output: [
        {
          file: `packages/${pkg}/lib/server.js`,
          format: 'cjs',
        },
        {
          file: `packages/${pkg}/esm/server.js`,
          format: 'esm',
        },
      ],
      plugins: [
        externals({
          deps: true,
          packagePath: path.resolve(`packages/${pkg}/package.json`),
        }),
        ...webPlugins,
      ],
    });
  }

  if (fs.existsSync(`packages/${pkg}/src/testing.ts`)) {
    targets.push({
      external: ['@aesthetic/style/lib/testing', '@aesthetic/system/lib/testing', './index'],
      input: `packages/${pkg}/src/testing.ts`,
      output: [
        {
          file: `packages/${pkg}/lib/testing.js`,
          format: 'cjs',
        },
        {
          file: `packages/${pkg}/esm/testing.js`,
          format: 'esm',
        },
      ],
      plugins: webPlugins,
    });
  }
});

// Node only
['compiler', 'cli'].forEach((pkg) => {
  targets.push({
    input: `packages/${pkg}/src/index.ts`,
    output: [
      {
        file: `packages/${pkg}/lib/index.js`,
        format: 'cjs',
      },
    ],
    plugins: [
      externals({
        deps: true,
        packagePath: path.resolve(`packages/${pkg}/package.json`),
      }),
      ...nodePlugins,
    ],
  });
});

export default targets;
