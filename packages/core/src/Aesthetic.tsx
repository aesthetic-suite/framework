import deepMerge from 'extend';
import { isObject } from 'aesthetic-utils';
import uuid from 'uuid/v4';
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
  passThemeProp: false,
  rtl: false,
  stylesPropName: 'styles',
  theme: 'default',
  themePropName: 'theme',
};

const ID_MAP = new Map<StyleSheetFactory<any>, string>();

export default class Aesthetic {
  globalSheets: { [themeName: string]: GlobalSheetFactory } = {};

  options: Readonly<AestheticOptions> = { ...DEFAULT_OPTIONS };

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
    const styleFactory = this.styleSheets[styleName];
    const styleSheet = styleFactory(this.getTheme(themeName));

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
   * Register a style sheet and return a unique ID.
   */
  registerStyleSheet<T = ThemeSheet>(styleSheet: StyleSheetFactory<T>): StyleName {
    if (ID_MAP.get(styleSheet)) {
      return ID_MAP.get(styleSheet)!;
    }

    const id = uuid();

    this.styleSheets[id] = this.validateDefinition(id, styleSheet) as StyleSheetFactory;

    ID_MAP.set(styleSheet, id);

    return id;
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
    extendFrom?: ThemeName,
  ): this {
    if (extendFrom) {
      return this.registerTheme(
        themeName,
        deepMerge(true, {}, this.getTheme(extendFrom), theme),
        globalSheet || this.globalSheets[extendFrom],
      );
    }

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
      ID_MAP.clear();
      this.globalSheets = {};
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
