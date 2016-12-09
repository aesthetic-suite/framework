/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type {
  StyleDeclarationMap,
  ClassNameMap,
} from './types';

export class Aesthetic {
  styles: { [key: string]: StyleDeclarationMap };
  transformed: { [key: string]: ClassNameMap };

  constructor() {
    this.styles = {};
    this.transformed = {};
  }

  /**
   * Clear transformed and attached styles from the DOM for the defined component.
   *
   * @param {String} styleName
   * @returns {Boolean}
   */
  clearStyles(styleName: string): boolean {
    delete this.transformed[styleName];

    return this.adapter.clear(styleName);
  }

  /**
   * Check to see if styles have already been transformed for a component.
   *
   * @param {String} styleName
   * @returns {Boolean}
   */
  hasBeenTransformed(styleName: string): boolean {
    return !!this.transformed[styleName];
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
   * Set multiple style declarations for a component.
   *
   * @param {String} styleName
   * @param {Object} declarations
   * @param {Boolean} [isDefault]
   * @returns {Aesthetic}
   */
  setStyles(styleName: string, declarations: StyleDeclarationMap, isDefault: boolean = true) {
    if (isDefault && this.hasStyles(styleName)) {
      throw new Error(
        `Cannot set default styles; styles already exist for \`${styleName}\`.`,
      );
    }

    if (this.hasBeenTransformed(styleName)) {
      throw new Error(
        `Cannot set new styles; styles have already been transformed for \`${styleName}\`.`,
      );
    }

    if (typeof declarations !== 'object') {
      throw new TypeError(`Style defined for \`${styleName}\` must be an object.`);
    }

    if (Object.keys(declarations).length > 0) {
      this.styles[styleName] = declarations;
    }

    return this;
  }

  /**
   * Execute the adapter transformer on the set of style declarations for the
   * defined component. Optionally support a custom theme.
   *
   * @param {String} styleName
   * @returns {Object}
   */
  transformStyles(styleName: string): ClassNameMap {
    if (this.hasBeenTransformed(styleName)) {
      return this.transformed[styleName];
    }

    const declarations = this.styles[styleName];

    if (!declarations) {
      throw new Error(`Styles do not exist for \`${styleName}\`.`);
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
            `\`${styleName}@${setName}\` is not a valid string.`,
          );
        }
      });
    }

    // Cache the values
    this.transformed[styleName] = classNames;

    return classNames;
  }
}

export default new Aesthetic();
