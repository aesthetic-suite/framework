/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { isObject } from 'aesthetic-utils';
import deepMerge from 'lodash.merge';
import Adapter from './Adapter';

import type {
  AestheticOptions,
  ClassName,
  GlobalDeclaration,
  StyleCallback,
  Statement,
  ThemeDeclaration,
  StyleSheet,
} from '../../types';

export default class Aesthetic {
  adapter: Adapter;

  cache: { [styleName: string]: StyleSheet } = {};

  native: boolean = false;

  options: AestheticOptions = {
    defaultTheme: '',
    extendable: false,
    pure: false,
    stylesPropName: 'classNames',
    themePropName: 'theme',
  };

  parents: { [childStyleName: string]: string } = {};

  styles: { [styleName: string]: StyleCallback | Statement } = {};

  themes: { [themeName: string]: ThemeDeclaration } = {};

  constructor(adapter: Adapter, options?: Object = {}) {
    this.options = {
      ...this.options,
      ...options,
    };

    this.setAdapter(adapter);
  }

  /**
   * Register a theme by extending and merging with a previously defined theme.
   */
  extendTheme(
    parentThemeName: string,
    themeName: string,
    theme?: ThemeDeclaration = {},
    globals?: GlobalDeclaration = {},
  ): this {
    return this.registerTheme(
      themeName,
      deepMerge({}, this.getTheme(parentThemeName), theme),
      globals,
    );
  }

  /**
   * Extract the defined style declarations. If the declaratin is a function,
   * execute it while passing the current theme and previous inherited styles.
   */
  getStyles(styleName: string, themeName?: string = ''): Statement {
    const parentStyleName = this.parents[styleName];
    const declarations = this.styles[styleName];

    if (__DEV__) {
      if (!declarations) {
        throw new Error(`Styles do not exist for "${styleName}".`);
      }
    }

    if (typeof declarations !== 'function') {
      return declarations;
    }

    return declarations(
      themeName ? this.getTheme(themeName) : {},
      parentStyleName ? this.getStyles(parentStyleName, themeName) : {},
    );
  }

  /**
   * Return a themes style object or throw an error.
   */
  getTheme(themeName?: string = ''): ThemeDeclaration {
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
    theme?: ThemeDeclaration = {},
    globals?: GlobalDeclaration = {},
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

    // Transform the global styles
    this.adapter.transform(':root', globals);

    return this;
  }

  /**
   * Set an adapter class to transform CSS style objects.
   */
  setAdapter(adapter: Adapter): this {
    if (adapter instanceof Adapter || (adapter && typeof adapter.transform === 'function')) {
      adapter.native = this.native; // eslint-disable-line
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
    statement: StyleCallback | Statement,
    extendFrom?: string = '',
  ): this {
    if (__DEV__) {
      if (this.styles[styleName]) {
        throw new Error(`Styles have already been set for "${styleName}".`);

      } else if (!isObject(statement) && typeof statement !== 'function') {
        throw new TypeError(`Styles defined for "${styleName}" must be an object or function.`);
      }
    }

    this.styles[styleName] = statement;

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
   * Execute the adapter transformer on the set of style declarations for the
   * defined component. Optionally support a custom theme.
   */
  transformStyles(styleName: string, themeName?: string): StyleSheet {
    const fallbackThemeName = themeName || this.options.defaultTheme || '';
    const cacheKey = `${styleName}:${fallbackThemeName}`;

    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    const declarations = this.getStyles(styleName, fallbackThemeName);
    const toTransform = {};
    const output = {};
    let setCount = 0;

    // Separate style objects from class names
    Object.keys(declarations).forEach((selector) => {
      if (typeof declarations[selector] === 'string') {
        output[selector] = this.native ? {} : declarations[selector];
      } else {
        toTransform[selector] = declarations[selector];
        setCount += 1;
      }
    });

    // Transform the styles into a map of class names
    if (setCount > 0) {
      const transformedOutput = this.adapter.transform(styleName, toTransform);

      Object.keys(transformedOutput).forEach((selector) => {
        output[selector] = this.validateTransform(styleName, selector, transformedOutput[selector]);
      });
    }

    // Cache the values
    this.cache[cacheKey] = output;

    return output;
  }

  /**
   * Validate the object returned contains valid strings.
   */
  validateTransform(styleName: string, selector: string, value: ClassName): ClassName {
    if (__DEV__) {
      if (typeof value !== 'string') {
        throw new TypeError(
          `\`${this.adapter.constructor.name}\` must return a mapping of CSS class names. ` +
          `"${styleName}@${selector}" is not a valid string.`,
        );
      }
    }

    return value;
  }
}
