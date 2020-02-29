import path from 'path';
import autoExternal from 'rollup-plugin-auto-external';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const packages = ['compiler', 'core', 'react', 'sss', 'style', 'system', 'utils'];

const external = packages.map(pkg => `@aesthetic/${pkg}`);
const plugins = [
  resolve({ extensions }),
  babel({
    exclude: 'node_modules/**',
    extensions,
  }),
];

export default packages
  .map(pkg => ({
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
  }))
  .concat({
    external: external.concat('./index'),
    input: `packages/core/src/testing.ts`,
    output: [
      {
        file: `packages/core/lib/testing.js`,
        format: 'cjs',
      },
      {
        file: `packages/core/esm/testing.js`,
        format: 'esm',
      },
    ],
    plugins,
  });
