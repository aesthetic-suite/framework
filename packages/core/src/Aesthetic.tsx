import deepMerge from 'extend';
import { isObject } from 'aesthetic-utils';
import Adapter from './Adapter';
import ClassNameAdapter from './ClassNameAdapter';
import {
  AestheticOptions,
  GlobalSheetFactory,
  StyleName,
  StyleSheet,
  StyleSheetFactory,
  ThemeName,
  ThemeSheet,
} from './types';

const DEFAULT_OPTIONS: AestheticOptions = {
  adapter: new ClassNameAdapter(),
  cxPropName: 'cx',
  extendable: false,
  passThemeProp: false,
  rtl: false,
  stylesPropName: 'styles',
  theme: 'default',
  themePropName: 'theme',
};

export default class Aesthetic {
  globalSheets: { [themeName: string]: GlobalSheetFactory } = {};

  options: Readonly<AestheticOptions> = {
    ...DEFAULT_OPTIONS,
  };

  parents: { [childStyleName: string]: StyleName } = {};

  styleSheets: { [styleName: string]: StyleSheetFactory } = {};

  themes: { [themeName: string]: ThemeSheet } = {};

  constructor(options: Partial<AestheticOptions> = {}) {
    this.configure(options);
  }

  /**
   * Change the current theme to another registered theme.
   * This will purge all flushed global styles and regenerate new ones.
   */
  changeTheme(themeName: ThemeName): this {
    const adapter = this.getAdapter();

    // Set theme as new option
    this.getTheme(themeName);
    this.configure({ theme: themeName });

    // Purge previous global styles
    adapter.resetGlobalStyles(this.options.theme);

    // Generate new global styles
    adapter.applyGlobalStyles({ theme: themeName });

    return this;
  }

  /**
   * Configure the global aesthetic instance by modifying the chosen adapter
   * and optional settings.
   */
  configure(options: Partial<AestheticOptions>) {
    this.options = {
      ...this.options,
      ...options,
    };

    this.options.adapter.aesthetic = this;
  }

  /**
   * Compose and extend multiple style sheets to create 1 style sheet.
   */
  extendStyles<T = ThemeSheet>(...styleSheets: StyleSheetFactory<T>[]): StyleSheetFactory<T> {
    return (theme: T) => {
      const sheets = styleSheets.map(sheet => sheet(theme));

      return deepMerge(true, {}, ...sheets);
    };
  }

  /**
   * Register a theme by extending and merging with a previously defined theme.
   */
  extendTheme<T = ThemeSheet>(
    themeName: ThemeName,
    parentThemeName: ThemeName,
    theme: Partial<T>,
    globalSheet?: GlobalSheetFactory<T>,
  ): this {
    return this.registerTheme(
      themeName,
      deepMerge(true, {}, this.getTheme(parentThemeName), theme) as T,
      globalSheet || this.globalSheets[parentThemeName],
    );
  }

  /**
   * Return the configured adapter.
   */
  getAdapter<N extends object, P extends object | string = N>(): Adapter<N, P> {
    return this.options.adapter;
  }

  /**
   * Retrieve the global style sheet for the defined theme.
   */
  getGlobalSheet(themeName: ThemeName): StyleSheet | null {
    const theme = this.getTheme(themeName);
    const globalFactory = this.globalSheets[themeName];

    if (!globalFactory) {
      return null;
    }

    return globalFactory(theme);
  }

  /**
   * Retrieve the component style sheet for the defined theme.
   */
  getStyleSheet(styleName: StyleName, themeName: ThemeName): StyleSheet {
    const parentStyleName = this.parents[styleName];
    const styleFactory = this.styleSheets[styleName];
    const styleSheet = styleFactory(this.getTheme(themeName));

    // Merge from parent
    if (parentStyleName) {
      return deepMerge(true, {}, this.getStyleSheet(parentStyleName, themeName), styleSheet);
    }

    return styleSheet;
  }

  /**
   * Return a theme object or throw an error.
   */
  getTheme<T = ThemeSheet>(name?: ThemeName): T {
    const themeName = name || this.options.theme;
    const theme = this.themes[themeName];

    if (__DEV__) {
      if (!theme || !isObject(theme)) {
        throw new Error(`Theme "${themeName}" does not exist.`);
      }
    }

    return (theme as unknown) as T;
  }

  /**
   * Register a style sheet definition. Optionally extend from a parent style sheet if defined.
   */
  registerStyleSheet<T = ThemeSheet>(
    styleName: StyleName,
    styleSheet: StyleSheetFactory<T>,
    extendFrom?: StyleName,
  ): this {
    if (extendFrom) {
      if (__DEV__) {
        if (!this.styleSheets[extendFrom]) {
          throw new Error(`Cannot extend from "${extendFrom}" as those styles do not exist.`);
        } else if (extendFrom === styleName) {
          throw new Error('Cannot extend styles from itself.');
        }
      }

      this.parents[styleName] = extendFrom;
    }

    this.styleSheets[styleName] = this.validateDefinition(
      styleName,
      styleSheet,
    ) as StyleSheetFactory;

    return this;
  }

  /**
   * Register a theme with a set of parameters. Optionally register
   * a global style sheet to apply to the entire document, and optionally
   * extend from a parent theme if defined.
   */
  registerTheme<T = ThemeSheet>(
    themeName: ThemeName,
    theme: T,
    globalSheet?: GlobalSheetFactory<T> | null,
  ): this {
    if (__DEV__) {
      if (this.themes[themeName]) {
        throw new Error(`Theme "${themeName}" already exists.`);
      } else if (!isObject(theme)) {
        throw new TypeError(`Theme "${themeName}" must be a style object.`);
      }
    }

    this.themes[themeName] = theme;

    if (globalSheet) {
      this.globalSheets[themeName] = this.validateDefinition(
        themeName,
        globalSheet,
      ) as GlobalSheetFactory;
    }

    return this;
  }

  /**
   * Reset state back to defaults for use within testing.
   */
  resetForTesting() {
    if (process.env.NODE_ENV === 'test') {
      this.globalSheets = {};
      this.parents = {};
      this.styleSheets = {};
      this.themes = {};
      this.configure(DEFAULT_OPTIONS);
    }
  }

  /**
   * Validate a style sheet or theme definition.
   */
  private validateDefinition<T>(key: string, value: T): T {
    if (__DEV__) {
      if (value !== null && typeof value !== 'function') {
        throw new TypeError(`Definition for "${key}" must be null or a function.`);
      }
    }

    return value;
  }
}
