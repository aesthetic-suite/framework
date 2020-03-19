/* eslint-disable import/no-extraneous-dependencies */

import fs from 'fs';
import path from 'path';
import externals from 'rollup-plugin-node-externals';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

// Order is imporant!
const packages = ['utils', 'system', 'style', 'sss', 'core', 'react', 'compiler'];
const targets = [];

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const plugins = [
  resolve({ extensions }),
  babel({
    exclude: 'node_modules/**',
    extensions,
  }),
];

packages.forEach(pkg => {
  targets.push({
    input: `packages/${pkg}/src/index.ts`,
    output: [
      {
        file: `packages/${pkg}/lib/index.js`,
        format: 'cjs',
      },
      {
        file: `packages/${pkg}/esm/index.js`,
        format: 'esm',
      },
    ],
    plugins: [
      externals({
        deps: true,
        packagePath: path.resolve(`packages/${pkg}/package.json`),
      }),
      ...plugins,
    ],
  });

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
      plugins,
    });
  }
});

export default targets;
