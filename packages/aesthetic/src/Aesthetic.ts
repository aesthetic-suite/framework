/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import isObject from './helpers/isObject';
import stripClassPrefix from './helpers/stripClassPrefix';
import Adapter from './Adapter';
import withStyles from './style';
import { ClassName, $FixMe, StyleName, ThemeName } from './types';

export interface AestheticOptions {
  defaultTheme: ThemeName;
  extendable: boolean;
  passThemeNameProp: boolean;
  passThemeProp: boolean;
  pure: boolean;
  stylesPropName: string;
  themePropName: string;
}

export default class Aesthetic<Theme, StyleSheet, Declaration> {
  adapter: Adapter<StyleSheet, Declaration>;

  cache: WeakMap<Declaration[], ClassName> = new WeakMap();

  options: AestheticOptions = {
    defaultTheme: '',
    extendable: false,
    passThemeNameProp: true,
    passThemeProp: true,
    pure: false,
    stylesPropName: 'styles',
    themePropName: 'theme',
  };

  parents: { [childStyleName: string]: string } = {};

  styles: { [styleName: string]: StyleSheet | StyleSheetCallback } = {};

  themes: { [themeName: string]: Theme } = {};

  constructor(adapter: Adapter<StyleSheet, Declaration>, options: Partial<AestheticOptions> = {}) {
    this.adapter = adapter;
    this.options = {
      ...this.options,
      ...options,
    };
  }

  /**
   * Return a stylesheet unique to an adapter.
   */
  createStyleSheet(
    styleName: StyleName,
    themeName: ThemeName = '',
    props: $FixMe = {},
  ): StyleSheet {
    return this.adapter.create(this.getStyles(styleName, themeName, props), styleName);
  }

  /**
   * Register a theme by extending and merging with a previously defined theme.
   */
  extendTheme(
    parentThemeName: ThemeName,
    themeName: ThemeName,
    theme: Theme,
    globals?: $FixMe,
  ): this {
    return this.registerTheme(
      themeName,
      this.adapter.merge(this.getTheme(parentThemeName), theme),
      globals,
    );
  }

  /**
   * Retrieve the defined style declarations. If the declaratin is a function,
   * execute it while passing the current theme and React props.
   */
  getStyles(styleName: StyleName, themeName: ThemeName = '', props: $FixMe = {}): StyleSheet {
    const parentStyleName = this.parents[styleName];
    let styleSheet = this.styles[styleName];

    if (process.env.NODE_ENV !== 'production') {
      if (!styleSheet) {
        throw new Error(`Styles do not exist for "${styleName}".`);
      }
    }

    // Extract styleSheet from callback
    if (typeof styleSheet === 'function') {
      styleSheet = styleSheet(themeName ? this.getTheme(themeName) : {}, props);
    }

    // Merge from parent
    if (parentStyleName) {
      styleSheet = this.adapter.merge(
        this.getStyles(parentStyleName, themeName, props),
        styleSheet,
      );
    }

    return styleSheet;
  }

  /**
   * Return a themes style object or throw an error.
   */
  getTheme(themeName: ThemeName = ''): Theme {
    const { defaultTheme } = this.options;

    let theme = this.themes[themeName];

    if (!theme && defaultTheme) {
      theme = this.themes[defaultTheme];
    }

    if (process.env.NODE_ENV !== 'production') {
      if (!theme) {
        throw new Error(`Theme "${themeName}" does not exist.`);
      }
    }

    return theme;
  }

  /**
   * Register a theme with a pre-defined set of theme settings.
   */
  registerTheme(themeName: ThemeName, theme: Theme, globals?: StyleSheet): this {
    if (process.env.NODE_ENV !== 'production') {
      if (this.themes[themeName]) {
        throw new Error(`Theme "${themeName}" already exists.`);
      } else if (!isObject(theme)) {
        throw new TypeError(`Theme "${themeName}" must be a style object.`);
      } else if (!isObject(globals)) {
        throw new TypeError(`Global styles for "${themeName}" must be an object.`);
      }
    }

    // Register the theme
    this.themes[themeName] = theme;

    // Create global styles
    if (globals) {
      const globalStyleSheet = this.adapter.create(globals, ':root');

      this.transformStyles(Object.values(globalStyleSheet));
    }

    return this;
  }

  /**
   * Set multiple style declarations for a component.
   */
  setStyles(
    styleName: StyleName,
    styleSheet: StyleSheet | StyleSheetCallback,
    extendFrom: StyleName = '',
  ): this {
    if (process.env.NODE_ENV !== 'production') {
      if (this.styles[styleName]) {
        throw new Error(`Styles have already been set for "${styleName}".`);
      } else if (!isObject(styleSheet) && typeof styleSheet !== 'function') {
        throw new TypeError(`Styles defined for "${styleName}" must be an object or function.`);
      }
    }

    this.styles[styleName] = styleSheet;

    if (extendFrom) {
      if (process.env.NODE_ENV !== 'production') {
        if (!this.styles[extendFrom]) {
          throw new Error(`Cannot extend from "${extendFrom}" as those styles do not exist.`);
        } else if (extendFrom === styleName) {
          throw new Error('Cannot extend styles from itself.');
        }
      }

      this.parents[styleName] = extendFrom;
    }

    return this;
  }

  /**
   * Execute the adapter transformer on the list of style declarations.
   */
  transformStyles(styles: Declaration[]): ClassName {
    if (this.cache.has(styles)) {
      return this.cache.get(styles)!;
    }

    const classNames: ClassName[] = [];
    const toTransform: Declaration[] = [];

    styles.forEach(style => {
      // Empty value or failed condition
      if (!style) {
        return; // eslint-disable-line

        // Acceptable class names
      } else if (typeof style === 'string' || typeof style === 'number') {
        classNames.push(
          ...String(style)
            .split(' ')
            .map(s => stripClassPrefix(s).trim()),
        );

        // Style objects
      } else if (isObject(style)) {
        toTransform.push(style);
      } else if (process.env.NODE_ENV !== 'production') {
        throw new Error('Unsupported style type to transform.');
      }
    });

    if (toTransform.length > 0) {
      classNames.push(this.adapter.transform(...toTransform));
    }

    const className = classNames.join(' ').trim();

    this.cache.set(styles, className);

    return className;
  }

  /**
   * Utility method for wrapping a component with a styles HOC.
   */
  withStyles(styleSheet: StyleSheet | StyleSheetCallback, options?: HOCOptions = {}): HOCWrapper {
    return withStyles(this, styleSheet, options);
  }
}
