import { transformAsync } from '@babel/core';

function transpile(code: string) {
  return transformAsync(code, {
    babelrc: false,
    configFile: false,
    filename: __filename,
    plugins: [
      [require.resolve('../src'), { setupPath: 'packages/babel-plugin/tests/setupAesthetic.ts' }],
    ],
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
})).addThemeVariant('dark', () => ({
  button: {
    color: 'black',
  }
}));
`);
  });
});
