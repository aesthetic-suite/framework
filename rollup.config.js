/* eslint-disable import/no-extraneous-dependencies */

import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';
import autoExternal from 'rollup-plugin-auto-external';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

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

glob
  .sync('packages/*', { onlyDirectories: true })
  .reverse()
  .forEach(pkgPath => {
    external.push(pkgPath.replace('packages', '@aesthetic'));

    targets.push({
      external,
      input: `${pkgPath}/src/index.ts`,
      output: [
        {
          file: `${pkgPath}/lib/index.js`,
          format: 'cjs',
        },
        {
          file: `${pkgPath}/esm/index.js`,
          format: 'esm',
        },
      ],
      plugins: [
        ...plugins,
        autoExternal({
          packagePath: path.resolve(`${pkgPath}/package.json`),
        }),
      ],
    });

    if (fs.existsSync(`${pkgPath}/src/testing.ts`)) {
      targets.push({
        external: external.concat('./index'),
        input: `${pkgPath}/src/testing.ts`,
        output: [
          {
            file: `${pkgPath}/lib/testing.js`,
            format: 'cjs',
          },
          {
            file: `${pkgPath}/esm/testing.js`,
            format: 'esm',
          },
        ],
        plugins,
      });
    }
  });

export default targets;
