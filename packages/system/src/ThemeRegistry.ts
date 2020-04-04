import Theme from './Theme';
import { ColorScheme, ContrastLevel, ThemeOptions, ThemeName } from './types';

export default class ThemeRegistry {
  protected defaultDarkTheme: string = '';

  protected defaultLightTheme: string = '';

  protected defaultTheme: string = '';

  protected themes: { [name: string]: Theme } = {};

  /**
   * Return the default dark theme.
   */
  getDarkTheme(): Theme {
    return this.getTheme(this.defaultDarkTheme);
  }

  /**
   * Return the default light theme.
   */
  getLightTheme(): Theme {
    return this.getTheme(this.defaultLightTheme);
  }

  /**
   * Find an approprite theme based on the user's or device's preferences.
   * Will check for preferred color schemes and contrast levels.
   */
  getPreferredTheme(): Theme {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersLightScheme = window.matchMedia('(prefers-color-scheme: light)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    const prefersLowContrast = window.matchMedia('(prefers-contrast: low)').matches;
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

    if (theme) {
      return theme;
    }

    throw new Error(`Theme "${name}" does not exist. Has it been registered?`);
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
        if (theme.scheme === 'dark' && this.defaultDarkTheme) {
          throw new Error(
            `"${this.defaultDarkTheme}" is already registered as the default dark theme.`,
          );
        } else if (theme.scheme === 'light' && this.defaultLightTheme) {
          throw new Error(
            `"${this.defaultLightTheme}" is already registered as the default light theme.`,
          );
        }
      }
    }

    if (isDefault) {
      if (theme.scheme === 'dark') {
        this.defaultDarkTheme = name;
      } else {
        this.defaultLightTheme = name;
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
    this.defaultDarkTheme = '';
    this.defaultLightTheme = '';
    this.themes = {};
  }
}
