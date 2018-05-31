/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import isObject from './helpers/isObject';
import stripClassPrefix from './helpers/stripClassPrefix';
import Adapter from './Adapter';
import withStyles from './style';

import type {
  AestheticOptions,
  ClassName,
  HOCOptions,
  HOCWrapper,
  StyleDeclaration,
  StyleSheet,
  StyleSheetCallback,
  ThemeSheet,
} from '../../types';

export default class Aesthetic {
  adapter: Adapter;

  cache: WeakMap<StyleDeclaration[], ClassName> = new WeakMap();

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

  themes: { [themeName: string]: ThemeSheet } = {};

  constructor(adapter: Adapter, options?: Object = {}) {
    this.options = {
      ...this.options,
      ...options,
    };

    this.setAdapter(adapter);
  }

  /**
   * Return a stylesheet unique to an adapter.
   */
  createStyleSheet(styleName: string, themeName?: string = '', props?: Object = {}): StyleSheet {
    return this.adapter.create(this.getStyles(styleName, themeName, props), styleName);
  }

  /**
   * Register a theme by extending and merging with a previously defined theme.
   */
  extendTheme(
    parentThemeName: string,
    themeName: string,
    theme?: ThemeSheet = {},
    globals?: StyleSheet = {},
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
  getStyles(styleName: string, themeName?: string = '', props?: Object = {}): StyleSheet {
    const parentStyleName = this.parents[styleName];
    let styleSheet = this.styles[styleName];

    if (__DEV__) {
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
  getTheme(themeName?: string = ''): ThemeSheet {
    const { defaultTheme } = this.options;

    let theme = this.themes[themeName];

    if (!theme && defaultTheme) {
      theme = this.themes[defaultTheme];
    }

    if (__DEV__) {
      if (!theme) {
        throw new Error(`Theme "${themeName}" does not exist.`);
      }
    }

    return theme;
  }

  /**
   * Register a theme with a pre-defined set of theme settings.
   */
  registerTheme(
    themeName: string,
    theme?: ThemeSheet = {},
    globals?: StyleSheet = {},
  ): this {
    if (__DEV__) {
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
    const globalStyleSheet = this.adapter.create(globals, ':root');

    // $FlowIgnore
    this.transformStyles(Object.values(globalStyleSheet));

    return this;
  }

  /**
   * Set an adapter class to transform CSS style objects.
   */
  setAdapter(adapter: Adapter): this {
    if (adapter instanceof Adapter || (adapter && typeof adapter.transform === 'function')) {
      this.adapter = adapter;

    } else if (__DEV__) {
      throw new TypeError('Adapter must be an instance of `Adapter`.');
    }

    return this;
  }

  /**
   * Set multiple style declarations for a component.
   */
  setStyles(
    styleName: string,
    styleSheet: StyleSheet | StyleSheetCallback,
    extendFrom?: string = '',
  ): this {
    if (__DEV__) {
      if (this.styles[styleName]) {
        throw new Error(`Styles have already been set for "${styleName}".`);

      } else if (!isObject(styleSheet) && typeof styleSheet !== 'function') {
        throw new TypeError(`Styles defined for "${styleName}" must be an object or function.`);
      }
    }

    this.styles[styleName] = styleSheet;

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

    return this;
  }

  /**
   * Execute the adapter transformer on the list of style declarations.
   */
  transformStyles(styles: StyleDeclaration[]): ClassName {
    if (this.cache.has(styles)) {
      // $FlowIgnore We check return swith has()
      return this.cache.get(styles);
    }

    const classNames = [];
    const toTransform = [];

    styles.forEach((style) => {
      // Empty value or failed condition
      if (!style) {
        return; // eslint-disable-line

      // Acceptable class names
      } else if (typeof style === 'string' || typeof style === 'number') {
        classNames.push(...String(style).split(' ').map(s => stripClassPrefix(s).trim()));

      // Style objects
      } else if (isObject(style)) {
        toTransform.push(style);

      } else if (__DEV__) {
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
