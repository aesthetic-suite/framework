import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const packages = [
  'adapter-aphrodite',
  'adapter-css-modules',
  'adapter-fela',
  'adapter-jss',
  'adapter-typestyle',
  'core',
  'react',
  'utils',
];

const plugins = [
  resolve({ extensions }),
  babel({
    exclude: 'node_modules/**',
    extensions,
  }),
];

const external = [
  'aesthetic',
  'aesthetic-utils',
  'aphrodite',
  'direction',
  'extend',
  'fela',
  'fela-dom',
  'hoist-non-react-statics',
  'jss',
  'react',
  'rtl-css-js',
  'rtl-css-js/core',
  'stylis',
  'typestyle',
  'uuid/v4',
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
    plugins,
  }))
  .concat({
    external,
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
