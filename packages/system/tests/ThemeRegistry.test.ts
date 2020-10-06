import { ThemeRegistry, Theme } from '../src';
import { lightTheme, darkTheme } from '../src/test';

describe('ThemeRegistry', () => {
  let registry: ThemeRegistry;
  let mediaMocks: { [query: string]: boolean } = {};

  beforeEach(() => {
    registry = new ThemeRegistry();
    registry.register('day', lightTheme, true);
    registry.register('night', darkTheme, true);

    // @ts-expect-error Omit other properties
    window.matchMedia = (query) => ({
      matches: mediaMocks[query] || false,
    });
  });

  afterEach(() => {
    lightTheme.name = '';
    darkTheme.name = '';
    mediaMocks = {};
  });

  describe('getDarkTheme()', () => {
    it('returns the default dark theme', () => {
      expect(registry.getDarkTheme()).toBe(darkTheme);
    });
  });

  describe('getLightTheme()', () => {
    it('returns the default light theme', () => {
      expect(registry.getLightTheme()).toBe(lightTheme);
    });
  });

  describe('getPreferredTheme()', () => {
    let highTheme: Theme;
    let lowTheme: Theme;

    beforeEach(() => {
      highTheme = darkTheme.extend({}, { contrast: 'high' });
      lowTheme = darkTheme.extend({}, { contrast: 'low' });

      registry.register('night-high', highTheme);
      registry.register('night-low', lowTheme);
    });

    it('errors if no themes', () => {
      registry = new ThemeRegistry();

      expect(() => {
        registry.getPreferredTheme();
      }).toThrow('No themes have been registered.');
    });

    it('returns 1st registered default theme if no media matches', () => {
      expect(registry.getPreferredTheme()).toBe(lightTheme);
    });

    it('returns dark theme if media matches', () => {
      mediaMocks['(prefers-color-scheme: dark)'] = true;
      mediaMocks['(prefers-color-scheme: light)'] = false;

      expect(registry.getPreferredTheme()).toBe(darkTheme);
    });

    it('returns light theme if media matches', () => {
      mediaMocks['(prefers-color-scheme: light)'] = true;
      mediaMocks['(prefers-color-scheme: dark)'] = false;

      expect(registry.getPreferredTheme()).toBe(lightTheme);
    });

    it('returns a dark high contrast theme if media matches', () => {
      mediaMocks['(prefers-color-scheme: dark)'] = true;
      mediaMocks['(prefers-contrast: high)'] = true;

      expect(registry.getPreferredTheme()).toBe(highTheme);
    });

    it('returns a dark low contrast theme if media matches', () => {
      mediaMocks['(prefers-color-scheme: dark)'] = true;
      mediaMocks['(prefers-contrast: low)'] = true;

      expect(registry.getPreferredTheme()).toBe(lowTheme);
    });

    it('returns a light theme if media doesnt match', () => {
      mediaMocks['(prefers-contrast: low)'] = true;

      expect(registry.getPreferredTheme()).toBe(lightTheme);
    });
  });

  describe('getTheme()', () => {
    it('errors if no name or empty name', () => {
      expect(() => {
        registry.getTheme('');
      }).toThrow('Cannot find a theme without a name.');
    });

    it('errors for a missing theme', () => {
      expect(() => {
        registry.getTheme('dusk');
      }).toThrow('Theme "dusk" does not exist. Has it been registered?');
    });

    it('returns the theme', () => {
      expect(registry.getTheme('day')).toBe(lightTheme);
    });
  });

  describe('register()', () => {
    it('errors if not a theme instance', () => {
      expect(() => {
        registry.register(
          'test',
          // @ts-expect-error
          {},
        );
      }).toThrow('Only a `Theme` object can be registered.');
    });

    it('errors if trying to set another default dark theme', () => {
      expect(() => {
        registry.register('nighter', darkTheme, true);
      }).toThrow('"night" is already registered as the default dark theme.');
    });

    it('errors if trying to set another light dark theme', () => {
      expect(() => {
        registry.register('dayer', lightTheme, true);
      }).toThrow('"day" is already registered as the default light theme.');
    });

    it('errors if trying to register an already registered theme', () => {
      expect(() => {
        registry.register('dayer', lightTheme);
      }).toThrow('Theme "dayer" has already been registered under "day".');
    });

    it('sets the name on the theme', () => {
      expect(lightTheme.name).toBe('day');
      expect(darkTheme.name).toBe('night');
    });
  });

  describe('reset()', () => {
    it('resets to initial state', () => {
      registry.reset();

      expect(() => {
        registry.getDarkTheme();
        // eslint-disable-next-line jest/require-to-throw-message
      }).toThrow();
    });
  });
});
