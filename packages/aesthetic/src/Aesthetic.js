/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import deepMerge from 'lodash.merge';
import isObject from './helpers/isObject';
import Adapter from './Adapter';
import withStyles from './style';

import type {
  AestheticOptions,
  ClassName,
  HOCOptions,
  HOCWrapper,
  Statement,
  StatementCallback,
  StyleDeclaration,
  StyleSheet,
  ThemeDeclaration,
} from '../../types';

export default class Aesthetic {
  adapter: Adapter;

  options: AestheticOptions = {
    defaultTheme: '',
    extendable: false,
    pure: false,
    stylesPropName: 'styles',
    themePropName: 'theme',
  };

  parents: { [childStyleName: string]: string } = {};

  styles: { [styleName: string]: Statement | StatementCallback } = {};

  themes: { [themeName: string]: ThemeDeclaration } = {};

  constructor(adapter: Adapter, options?: Object = {}) {
    this.options = {
      ...this.options,
      ...options,
    };

    this.setAdapter(adapter);
  }

  /**
   * Extract the defined style declarations. If the declaratin is a function,
   * execute it while passing the current theme and React props.
   */
  createStyleSheet(styleName: string, themeName?: string = '', props?: Object = {}): StyleSheet {
    const parentStyleName = this.parents[styleName];
    let styleSheet = this.styles[styleName];

    if (__DEV__) {
      if (!styleSheet) {
        throw new Error(`Styles do not exist for "${styleName}".`);
      }
    }

    // Extract statement from callback
    if (typeof styleSheet === 'function') {
      styleSheet = styleSheet(themeName ? this.getTheme(themeName) : {}, props);
    }

    // Merge from parent
    if (parentStyleName) {
      styleSheet = deepMerge(
        {},
        this.createStyleSheet(parentStyleName, themeName, props),
        styleSheet,
      );
    }

    return this.adapter.create(styleSheet);
  }

  /**
   * Register a theme by extending and merging with a previously defined theme.
   */
  extendTheme(
    parentThemeName: string,
    themeName: string,
    theme?: ThemeDeclaration = {},
    globals?: Statement = {},
  ): this {
    return this.registerTheme(
      themeName,
      deepMerge({}, this.getTheme(parentThemeName), theme),
      globals,
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
    globals?: Statement = {},
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
    // TODO
    // this.adapter.transform(':root', globals);

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
    statement: Statement | StatementCallback,
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
   * Execute the adapter transformer on the list of style declarations.
   */
  transformStyles(styles: StyleDeclaration[]): ClassName {
    const classNames = [];
    const toTransform = [];

    styles.forEach((style) => {
      // TODO combine with classes()
      if (typeof style === 'string') {
        classNames.push(style);
      } else {
        toTransform.push(style);
      }
    });

    if (toTransform.length > 0) {
      classNames.push(this.adapter.transform(...toTransform));
    }

    return classNames.join(' ');
  }

  /**
   * Utility method for wrapping a component with a styles HOC.
   */
  withStyles(statement: Statement | StatementCallback, options?: HOCOptions = {}): HOCWrapper {
    return withStyles(this, statement, options);
  }
}
