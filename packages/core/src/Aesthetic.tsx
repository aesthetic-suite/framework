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

export default class Aesthetic {
  options: Readonly<AestheticOptions> = {
    adapter: new ClassNameAdapter(),
    cxPropName: 'cx',
    extendable: false,
    passThemeProp: false,
    rtl: false,
    stylesPropName: 'styles',
    theme: 'default',
    themePropName: 'theme',
  };

  protected globals: { [themeName: string]: GlobalSheetFactory<ThemeSheet> } = {};

  protected parents: { [childStyleName: string]: StyleName } = {};

  protected styles: { [styleName: string]: StyleSheetFactory<ThemeSheet> } = {};

  protected themes: { [themeName: string]: ThemeSheet } = {};

  get adapter(): Adapter<{}> {
    return this.options.adapter;
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
  }

  /**
   * Retrieve the component style sheet for the defined theme.
   * If the definition is a function, execute it while passing the current theme.
   */
  getStyleSheet(styleName: StyleName, themeName: ThemeName): StyleSheet {
    const parentStyleName = this.parents[styleName];
    const styleDef = this.styles[styleName];
    const styleSheet = styleDef(this.getTheme(themeName || this.options.theme));

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
  registerStyleSheet(
    styleName: StyleName,
    styleSheet: StyleSheetFactory<ThemeSheet>,
    extendFrom?: StyleName,
  ): this {
    if (extendFrom) {
      if (__DEV__) {
        if (!this.styles[extendFrom]) {
          throw new Error(`Cannot extend from "${extendFrom}" as those styles do not exist.`);
        } else if (extendFrom === styleName) {
          throw new Error('Cannot extend styles from itself.');
        }
      }

      this.parents[styleName] = extendFrom;
    }

    this.styles[styleName] = this.validateDefinition(styleName, styleSheet);

    return this;
  }

  /**
   * Register a theme with a set of parameters. Optionally register
   * a global style sheet to apply to the entire document, and optionally
   * extend from a parent theme if defined.
   */
  registerTheme(
    themeName: ThemeName,
    theme: ThemeSheet,
    globalSheet: GlobalSheetFactory<ThemeSheet> = null,
    extendFrom: ThemeName = '',
  ): this {
    if (extendFrom) {
      return this.registerTheme(
        themeName,
        deepMerge(true, {}, this.getTheme(extendFrom), theme),
        globalSheet || this.globals[extendFrom],
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
    this.globals[themeName] = this.validateDefinition(themeName, globalSheet);

    return this;
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
