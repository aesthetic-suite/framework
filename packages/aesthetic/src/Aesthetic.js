/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import deepMerge from 'lodash.merge';
import Adapter from './Adapter';
import isObject from '../../aesthetic-utils/src/isObject';

import type {
  AestheticOptions,
  StyleDeclaration,
  StyleDeclarationMap,
  StyleDeclarationOrCallback,
  TransformedStylesMap,
  CSSStyle,
} from '../../types';

export default class Aesthetic {
  adapter: Adapter;
  cache: { [styleName: string]: TransformedStylesMap } = {};
  native: boolean = false;
  options: AestheticOptions = {
    stylesPropName: 'classNames',
    themePropName: 'theme',
    extendable: false,
  };
  parents: { [childStyleName: string]: string } = {};
  styles: { [styleName: string]: StyleDeclarationOrCallback } = {};
  themes: { [themeName: string]: CSSStyle } = {};

  constructor(adapter: Adapter, options: Object = {}) {
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
    theme: CSSStyle = {},
    globals: StyleDeclarationMap = {},
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
  getStyles(styleName: string, themeName: string = ''): StyleDeclarationMap {
    const parentStyleName = this.parents[styleName];
    const declarations = this.styles[styleName];

    if (process.env.NODE_ENV === 'development') {
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
  getTheme(themeName: string): CSSStyle {
    const theme = this.themes[themeName];

    if (process.env.NODE_ENV === 'development') {
      if (!theme) {
        throw new Error(`Theme "${themeName}" does not exist.`);
      }
    }

    return theme;
  }

  /**
   * Register a theme with a pre-defined set of theme settings.
   */
  registerTheme(themeName: string, theme: CSSStyle = {}, globals: StyleDeclarationMap = {}): this {
    if (process.env.NODE_ENV === 'development') {
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
    if (adapter instanceof Adapter) {
      adapter.native = this.native;
      this.adapter = adapter;

    } else if (process.env.NODE_ENV === 'development') {
      throw new TypeError('Adapter must be an instance of `Adapter`.');
    }

    return this;
  }

  /**
   * Set multiple style declarations for a component.
   */
  setStyles(styleName: string, declarations: StyleDeclarationOrCallback, extendFrom: string = ''): this {
    if (process.env.NODE_ENV === 'development') {
      if (this.styles[styleName]) {
        throw new Error(`Styles have already been set for "${styleName}".`);

      } else if (!isObject(declarations) && typeof declarations !== 'function') {
        throw new TypeError(`Styles defined for "${styleName}" must be an object or function.`);
      }
    }

    this.styles[styleName] = declarations;

    if (extendFrom) {
      if (process.env.NODE_ENV === 'development') {
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
  transformStyles(styleName: string, themeName: string = ''): TransformedStylesMap {
    const cacheKey = `${styleName}:${themeName}`;

    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    const declarations = this.getStyles(styleName, themeName);
    const toTransform = {};
    const output = {};
    let setCount = 0;

    // Separate style objects from class names
    Object.keys(declarations).forEach((setName: string) => {
      if (typeof declarations[setName] === 'string') {
        output[setName] = this.native ? {} : declarations[setName];
      } else {
        toTransform[setName] = declarations[setName];
        setCount += 1;
      }
    });

    // Transform the styles into a map of class names
    if (setCount > 0) {
      const transformedOutput = this.adapter.transform(styleName, toTransform);

      Object.keys(transformedOutput).forEach((setName: string) => {
        output[setName] = this.validateTransform(styleName, setName, transformedOutput[setName]);
      });
    }

    // Cache the values
    this.cache[cacheKey] = output;

    return output;
  }

  /**
   * Validate the object returned contains valid strings.
   */
  validateTransform(styleName: string, setName: string, value: StyleDeclaration): StyleDeclaration {
    if (process.env.NODE_ENV === 'development') {
      if (typeof value !== 'string') {
        throw new TypeError(
          `\`${this.adapter.constructor.name}\` must return a mapping of CSS class names. ` +
          `"${styleName}@${setName}" is not a valid string.`,
        );
      }
    }

    return value;
  }
}
