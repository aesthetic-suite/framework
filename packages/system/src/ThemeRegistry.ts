import Theme from './Theme';
import { ColorScheme, ContrastLevel, QueryParams } from './types';

export default class ThemeRegistry {
  defaultDarkTheme: string = '';

  defaultLightTheme: string = '';

  themes = new Map<string, Theme>();

  /**
   * Returns the default dark theme.
   */
  getDarkTheme(): Theme {
    return this.getTheme(this.defaultDarkTheme);
  }

  /**
   * Returns the default light theme.
   */
  getLightTheme(): Theme {
    return this.getTheme(this.defaultLightTheme);
  }

  /**
   * Finds an approprite theme based on the user's or device's preferences.
   * Will check for preferred color schemes and contrast levels.
   */
  getPreferredTheme(): Theme {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersLightScheme = window.matchMedia('(prefers-color-scheme: light)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    const prefersLowContrast = window.matchMedia('(prefers-contrast: low)').matches;
    const schemeCheckOrder: ColorScheme[] = ['light', 'dark'];

    if (prefersDarkScheme) {
      schemeCheckOrder.reverse();
    }

    let possibleTheme: Theme | undefined;

    // Find a theme based on device preferences
    schemeCheckOrder.some(scheme => {
      const contrastCheckOrder: ContrastLevel[] = ['normal'];

      if (prefersHighContrast) {
        contrastCheckOrder.unshift('high');
      } else if (prefersLowContrast) {
        contrastCheckOrder.unshift('low');
      }

      return contrastCheckOrder.some(contrast => {
        possibleTheme = this.query({ contrast, scheme });

        return !!possibleTheme;
      });
    });

    if (possibleTheme) {
      return possibleTheme;
    }

    // None found, return a default theme
    if (prefersLightScheme && this.defaultLightTheme) {
      return this.getLightTheme();
    } else if (prefersDarkScheme && this.defaultDarkTheme) {
      return this.getDarkTheme();
    }

    // Not sure how we got here but return something
    if (this.themes.size > 0) {
      return Array.from(this.themes.values())[0];
    }

    throw new Error('Unable to find a preferred theme as no themes have been registered.');
  }

  /**
   * Return a theme by name or throw an error if not found.
   */
  getTheme(name: string) {
    if (__DEV__) {
      if (!name) {
        throw new Error('Cannot find a theme without a name.');
      }
    }

    const theme = this.themes.get(name);

    if (theme) {
      return theme;
    }

    throw new Error(`Theme "${name}" does not exist. Has it been registered?`);
  }

  /**
   * Query for a theme that matches the defined parameters.
   */
  query(params: QueryParams): Theme | undefined {
    return Array.from(this.themes.values()).find(theme => {
      const conditions: boolean[] = [];

      if (params.contrast) {
        conditions.push(theme.contrast === params.contrast);
      }

      if (params.scheme) {
        conditions.push(theme.scheme === params.scheme);
      }

      return conditions.every(c => c === true);
    });
  }

  /**
   * Register a theme with a unique name. Can optionally mark a theme
   * as default for their defined color scheme.
   */
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

    this.themes.set(name, theme);

    return this;
  }
}
