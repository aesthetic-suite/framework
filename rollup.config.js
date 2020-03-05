import path from 'path';
import autoExternal from 'rollup-plugin-auto-external';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const packages = ['compiler', 'sss', 'style', 'system', 'utils'];

const plugins = [
  resolve({ extensions }),
  babel({
    exclude: 'node_modules/**',
    extensions,
  }),
];

const external = [
  '@aesthetic/compiler',
  '@aesthetic/sss',
  '@aesthetic/style',
  '@aesthetic/system',
  '@aesthetic/utils',
];

export default packages.map(pkg => ({
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
}));
