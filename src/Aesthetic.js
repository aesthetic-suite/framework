/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Adapter from './Adapter';

import type {
  StyleDeclarationMap,
  ClassNameMap,
} from './types';

export class Aesthetic {
  styles: { [key: string]: StyleDeclarationMap };
  adapter: Adapter;

  constructor() {
    this.styles = {};
    this.adapter = new Adapter();
  }

  /**
   * Clear transformed and attached styles from the DOM for the defined component.
   *
   * @param {String} styleName
   * @returns {Boolean}
   */
  clearStyles(styleName: string): boolean {
    return this.adapter.clear(styleName);
  }

  /**
   * Check to see if styles have already been defined for a component.
   *
   * @param {String} styleName
   * @returns {Boolean}
   */
  hasStyles(styleName: string): boolean {
    return !!this.styles[styleName];
  }

  /**
   * Set an adapter class to transform CSS style objects.
   *
   * @param {Adapter} adapter
   * @returns {Aesthetic}
   */
  setAdapter(adapter: Adapter) {
    if (!(adapter instanceof Adapter)) {
      throw new TypeError('Adapter must be an instance of `Adapter`.');
    }

    this.adapter = adapter;

    return this;
  }

  /**
   * Set multiple style declarations for a component.
   *
   * @param {String} styleName
   * @param {Object} declarations
   * @returns {Aesthetic}
   */
  setStyles(styleName: string, declarations: StyleDeclarationMap) {
    this.styles[styleName] = declarations;

    return this;
  }

  /**
   * Execute the adapter transformer on the set of style declarations for the
   * defined component. Optionally support a custom theme.
   *
   * @param {String} styleName
   * @param {String} themeName
   * @returns {Object}
   */
  transformStyles(styleName: string, themeName: string = ''): ClassNameMap {
    const declarations = this.styles[styleName];

    if (!declarations) {
      throw new Error(`Styles do not exist for ${styleName}.`);
    }

    const toTransform = {};
    const classNames = {};
    let setCount = 0;

    // Separate style objects from class names
    Object.keys(declarations).forEach((setName) => {
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
      Object.keys(transformedClassNames).forEach((setName) => {
        if (typeof transformedClassNames[setName] === 'string') {
          classNames[setName] = transformedClassNames[setName];
        } else {
          throw new TypeError(
            'Adapter must return a mapping of CSS class names. ' +
            `${styleName}@${setName} is not a valid string.`,
          );
        }
      });
    }

    return classNames;
  }
}

export default new Aesthetic();
