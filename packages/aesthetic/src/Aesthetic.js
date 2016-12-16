/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import deepMerge from 'lodash.merge';
import Adapter from './Adapter';

import type { ComponentDeclarations, ClassNames } from './types';

export default class Aesthetic {
  adapter: Adapter;
  locked: { [key: string]: boolean };
  styles: { [key: string]: ComponentDeclarations };
  classNames: { [key: string]: ClassNames };

  constructor(adapter: Adapter) {
    this.locked = {};
    this.styles = {};
    this.classNames = {};
    this.setAdapter(adapter);
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
   * Set an adapter class to transform CSS style objects.
   */
  setAdapter(adapter: Adapter): this {
    if (!(adapter instanceof Adapter)) {
      throw new TypeError('Adapter must be an instance of `Adapter`.');
    }

    this.adapter = adapter;

    return this;
  }

  /**
   * Set multiple style declarations for a component.
   * If `merge` is true, it will deep merge with any previous styles,
   * otherwise it will completely override them.
   */
  setStyles(
    styleName: string,
    declarations: ComponentDeclarations,
    merge: boolean = false,
  ): this {
    if (this.locked[styleName]) {
      throw new Error(
        `Cannot set styles; styles have been locked for \`${styleName}\`.`,
      );
    }

    if (this.classNames[styleName]) {
      throw new Error(
        `Cannot set styles; styles have already been transformed for \`${styleName}\`.`,
      );
    }

    if (!declarations || Array.isArray(declarations) || typeof declarations !== 'object') {
      throw new TypeError(`Styles defined for \`${styleName}\` must be an object.`);
    }

    const prevDeclarations = this.styles[styleName];

    if (prevDeclarations && merge) {
      this.styles[styleName] = deepMerge(prevDeclarations, declarations);
    } else {
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
  transformStyles(styleName: string): ClassNames {
    if (this.classNames[styleName]) {
      return this.classNames[styleName];
    }

    const declarations = this.styles[styleName];

    if (!declarations) {
      throw new Error(`Styles do not exist for \`${styleName}\`.`);
    }

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
        } else {
          throw new TypeError(
            'Adapter must return a mapping of CSS class names. ' +
            `\`${styleName}@${setName}\` is not a valid string.`,
          );
        }
      });
    }

    // Cache the values
    this.classNames[styleName] = classNames;

    return classNames;
  }
}
