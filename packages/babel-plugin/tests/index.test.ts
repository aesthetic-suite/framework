import { transformAsync } from '@babel/core';
import plugin from '../src';

function transpile(code: string) {
  return transformAsync(code, {
    babelrc: false,
    configFile: false,
    filename: `${__dirname}/index.test.ts`,
    plugins: [plugin],
  });
}

describe('Babel', () => {
  it('transpiles', async () => {
    const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  button: {
    display: 'inline-block',
  }
}));
`);
  });
});
