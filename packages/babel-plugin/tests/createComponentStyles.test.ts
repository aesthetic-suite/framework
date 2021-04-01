import { transformAsync } from '@babel/core';

function transpile(code: string) {
  return transformAsync(code, {
    babelrc: false,
    configFile: false,
    filename: __filename,
    plugins: [[require.resolve('../src'), { setupPath: 'tests/setupAesthetic.ts' }]],
  });
}

describe('Babel', () => {
  it('transforms a single property', async () => {
    const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  element: {
    display: 'inline-block',
  }
}));
`);

    expect(result?.code).toMatchInlineSnapshot(`
      "import { createComponentStyles } from '@aesthetic/local';
      const styleSheet = createComponentStyles(() => ({
        element: {
          display: 'inline-block'
        }
      }), {
        element: {
          result: \\"c169hbqq\\"
        }
      });"
    `);
  });

  it('transforms multiple properties', async () => {
    const result = await transpile(`
import { createComponentStyles } from '@aesthetic/local';

const styleSheet = createComponentStyles(() => ({
  element: {
    display: 'inline-block',
    position: 'relative',
  }
}));
`);

    expect(result?.code).toMatchInlineSnapshot(`
      "import { createComponentStyles } from '@aesthetic/local';
      const styleSheet = createComponentStyles(() => ({
        element: {
          display: 'inline-block',
          position: 'relative'
        }
      }), {
        element: {
          result: \\"c169hbqq c1et6jhk\\"
        }
      });"
    `);
  });
});
