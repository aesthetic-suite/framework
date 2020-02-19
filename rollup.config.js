import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const packages = [
  'adapter-aphrodite',
  'adapter-css-modules',
  'adapter-fela',
  'adapter-jss',
  'adapter-typestyle',
  'compiler',
  'core',
  'react',
  'sss',
  'system',
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
  '@aesthetic/sss',
  '@aesthetic/style',
  '@aesthetic/system',
  '@aesthetic/utils',
  '@boost/common',
  'aesthetic',
  'aesthetic-utils',
  'aphrodite',
  'direction',
  'ejs',
  'extend',
  'fela',
  'fela-dom',
  'hoist-non-react-statics',
  'jss',
  'js-yaml',
  'lodash',
  'optimal',
  'prettier',
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
