/* eslint-disable import/no-extraneous-dependencies */

import fs from 'fs';
import path from 'path';
import autoExternal from 'rollup-plugin-auto-external';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

// Order is imporant!
const packages = ['utils', 'system', 'style', 'sss', 'core', 'react', 'compiler'];

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const plugins = [
  resolve({ extensions }),
  babel({
    exclude: 'node_modules/**',
    extensions,
  }),
];

const external = ['rtl-css-js/core', '@aesthetic/system/lib/testing'];
const targets = [];

packages.forEach(pkg => {
  external.push(`@aesthetic/${pkg}`, `@aesthetic/${pkg}/lib/testing`);

  targets.push({
    external,
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
      ...plugins,
      autoExternal({
        packagePath: path.resolve(`packages/${pkg}/package.json`),
      }),
    ],
  });

  if (fs.existsSync(`packages/${pkg}/src/testing.ts`)) {
    targets.push({
      external: external.concat('./index'),
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
