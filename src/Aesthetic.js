/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Adapter from './Adapter';

import type { ComponentDeclarations } from './types';

export default class Aesthetic {
  adapter: Adapter;

  constructor(adapter: Adapter) {
    this.setAdapter(adapter);
  }

  /**
   * Lock the component from being styled any further.
   */
  lockStyling(styleName: string): this {
    // TODO
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
    merge: boolean = true,
  ): this {
    // TODO
    return this;
  }
}
