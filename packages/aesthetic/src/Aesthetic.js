/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Adapter from './Adapter';
import isObject from './helpers/isObject';

import type {
  StyleDeclarations,
  StyleOrCallback,
  ClassNames,
  CSSStyle,
} from '../../types';

export default class Aesthetic {
  adapter: Adapter;
  locked: { [key: string]: boolean } = {};
  styles: { [key: string]: StyleOrCallback } = {};
  prevStyles: { [key: string]: StyleOrCallback } = {};
  themes: { [key: string]: CSSStyle } = {};
  classNames: { [key: string]: ClassNames } = {};

  constructor(adapter: Adapter) {
    this.setAdapter(adapter);
  }

  /**
   * Extract the defined style declarations. If the declaratin is a function,
   * execute it while passing the current theme and previous styles.
   */
  extractDeclarations(styleName: string, themeName: string = ''): StyleDeclarations {
    let declarations = this.styles[styleName];
    let prevDeclarations = this.prevStyles[styleName] || {};

    if (process.env.NODE_ENV === 'development') {
      if (!declarations) {
        throw new Error(`Styles do not exist for "${styleName}".`);

      } else if (themeName && !this.themes[themeName]) {
        throw new Error(`Theme "${themeName}" does not exist.`);
      }
    }

    const theme = this.themes[themeName] || {};

    if (typeof prevDeclarations === 'function') {
      prevDeclarations = prevDeclarations(theme, {});
    }

    if (typeof declarations === 'function') {
      declarations = declarations(theme, prevDeclarations);
    }

    return declarations;
  }

  /**
   * Lock the component from being styled any further.
   */
  lockStyling(styleName: string): this {
    if (this.styles[styleName]) {
      this.locked[styleName] = true;
    }

    return this;
  }

  /**
   * Register a theme with a pre-defined set of theme settings.
   */
  registerTheme(themeName: string, theme: CSSStyle = {}, globals: StyleDeclarations = {}): this {
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
      this.adapter = adapter;
    } else if (process.env.NODE_ENV === 'development') {
      throw new TypeError('Adapter must be an instance of `Adapter`.');
    }

    return this;
  }

  /**
   * Set multiple style declarations for a component.
   */
  setStyles(styleName: string, declarations: StyleOrCallback): this {
    if (process.env.NODE_ENV === 'development') {
      if (this.locked[styleName]) {
        throw new Error(`Styles have been locked for "${styleName}".`);

      } else if (!isObject(declarations) && typeof declarations !== 'function') {
        throw new TypeError(`Styles defined for "${styleName}" must be an object or function.`);
      }
    }

    // Keep the previous styles
    if (this.styles[styleName]) {
      this.prevStyles[styleName] = this.styles[styleName];
    }

    // Store the new styles
    this.styles[styleName] = declarations;

    return this;
  }

  /**
   * Execute the adapter transformer on the set of style declarations for the
   * defined component. Optionally support a custom theme.
   */
  transformStyles(styleName: string, themeName: string = ''): ClassNames {
    const cacheKey = `${styleName}:${themeName}`;

    if (this.classNames[cacheKey]) {
      return this.classNames[cacheKey];
    }

    const declarations = this.extractDeclarations(styleName, themeName);
    const toTransform = {};
    const classNames = {};
    let setCount = 0;

    // Separate style objects from class names
    Object.keys(declarations).forEach((setName: string) => {
      if (typeof declarations[setName] === 'string') {
        classNames[setName] = declarations[setName];
      } else {
        toTransform[setName] = declarations[setName];
        setCount += 1;
      }
    });

    // Transform the styles into a map of class names
    if (setCount > 0) {
      const transformedClassNames = this.adapter.transform(styleName, toTransform);

      // Validate the object returned contains valid strings
      Object.keys(transformedClassNames).forEach((setName: string) => {
        if (typeof transformedClassNames[setName] === 'string') {
          classNames[setName] = transformedClassNames[setName];
        } else if (process.env.NODE_ENV === 'development') {
          throw new TypeError(
            `\`${this.adapter.constructor.name}\` must return a mapping of CSS class names. ` +
            `"${styleName}@${setName}" is not a valid string.`,
          );
        }
      });
    }

    // Cache the values
    this.classNames[cacheKey] = classNames;

    return classNames;
  }
}
