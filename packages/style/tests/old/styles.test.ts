import converter from '@aesthetic/addon-direction';
import prefixer from '@aesthetic/addon-vendor';
import Renderer from '../src/client/ClientRenderer';
import { getRenderedStyles, purgeStyles } from '../src/testing';

describe('Styles', () => {
  let renderer: Renderer;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    renderer = new Renderer({
      converter,
      prefixer,
    });

    // Avoid warnings
    spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();

    purgeStyles();
  });

  it('can apply CSS variables to the root', () => {
    renderer.applyRootVariables({
      someVar: '10px',
      '--already-formatted-var': '10em',
      'missing-prefix': '10px',
      mixOfBoth: '10px',
    });

    const root = document.documentElement;

    expect(root.style.getPropertyValue('--some-var')).toBe('10px');
    expect(root.style.getPropertyValue('--already-formatted-var')).toBe('10em');
    expect(root.style.getPropertyValue('--missing-prefix')).toBe('10px');
    expect(root.style.getPropertyValue('--mix-of-both')).toBe('10px');
  });
});
