import { ThemeName } from '@aesthetic/types';
import Theme from './Theme';
import { ColorScheme, ContrastLevel, ThemeOptions } from './types';

export default class ThemeRegistry {
  protected darkTheme: string = '';

  protected defaultTheme: string = '';

  protected lightTheme: string = '';

  protected themes: Record<string, Theme> = {};

  /**
   * Return the default dark theme.
   */
  getDarkTheme(): Theme {
    return this.getTheme(this.darkTheme);
  }

  /**
   * Return the default light theme.
   */
  getLightTheme(): Theme {
    return this.getTheme(this.lightTheme);
  }

  /**
   * Find an approprite theme based on the user's or device's preferences.
   * Will check for preferred color schemes and contrast levels.
   */
  getPreferredTheme(): Theme {
    // Dont prepend `window.` to support React Native
    const prefersDarkScheme = matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersLightScheme = matchMedia('(prefers-color-scheme: light)').matches;
    const prefersHighContrast = matchMedia('(prefers-contrast: high)').matches;
    const prefersLowContrast = matchMedia('(prefers-contrast: low)').matches;
    const schemeCheckOrder: ColorScheme[] = [];

    if (prefersDarkScheme) {
      schemeCheckOrder.push('dark');
    } else if (prefersLightScheme) {
      schemeCheckOrder.push('light');
    }

    let possibleTheme: Theme | undefined;

    // Find a theme based on device preferences
    schemeCheckOrder.some((scheme) => {
      const contrastCheckOrder: ContrastLevel[] = ['normal'];

      if (prefersHighContrast) {
        contrastCheckOrder.unshift('high');
      } else if (prefersLowContrast) {
        contrastCheckOrder.unshift('low');
      }

      return contrastCheckOrder.some((contrast) => {
        possibleTheme = this.query({ contrast, scheme });

        return !!possibleTheme;
      });
    });

    if (possibleTheme) {
      return possibleTheme;
    } else if (this.defaultTheme) {
      return this.getTheme(this.defaultTheme);
    }

    throw new Error('No themes have been registered.');
  }

  /**
   * Return a theme by name or throw an error if not found.
   */
  getTheme(name: ThemeName): Theme {
    if (__DEV__) {
      if (!name) {
        throw new Error('Cannot find a theme without a name.');
      }
    }

    const theme = this.themes[name];

    if (__DEV__) {
      if (!theme) {
        throw new Error(`Theme "${name}" does not exist. Has it been registered?`);
      }
    }

    return theme;
  }

  /**
   * Query for a theme that matches the defined parameters.
   */
  query(params: Partial<ThemeOptions>): Theme | undefined {
    return Object.values(this.themes).find((theme) => {
      const conditions: boolean[] = [];

      if (params.contrast) {
        conditions.push(theme.contrast === params.contrast);
      }

      if (params.scheme) {
        conditions.push(theme.scheme === params.scheme);
      }

      return conditions.every((c) => c === true);
    });
  }

  /**
   * Register a theme with a unique name. Can optionally mark a theme
   * as default for their defined color scheme.
   */
  // eslint-disable-next-line complexity
  register(name: string, theme: Theme, isDefault: boolean = false): this {
    if (__DEV__) {
      if (!(theme instanceof Theme)) {
        throw new TypeError('Only a `Theme` object can be registered.');
      }

      if (isDefault) {
        if (theme.scheme === 'dark' && this.darkTheme) {
          throw new Error(`"${this.darkTheme}" is already registered as the default dark theme.`);
        } else if (theme.scheme === 'light' && this.lightTheme) {
          throw new Error(`"${this.lightTheme}" is already registered as the default light theme.`);
        }
      }
    }

    if (isDefault) {
      if (theme.scheme === 'dark') {
        this.darkTheme = name;
      } else {
        this.lightTheme = name;
      }
    }

    if (theme.name) {
      if (__DEV__) {
        throw new Error(`Theme "${name}" has already been registered under "${theme.name}".`);
      }
    } else {
      // eslint-disable-next-line no-param-reassign
      theme.name = name;
    }

    if (!this.defaultTheme) {
      this.defaultTheme = name;
    }

    this.themes[name] = theme;

    return this;
  }

  /**
   * Reset the registry to initial state.
   */
  reset() {
    this.darkTheme = '';
    this.lightTheme = '';
    this.defaultTheme = '';
    this.themes = {};
  }
}
