/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { StyleSheet } from '../../types';

export default class Adapter {
  bypassNativeStyleSheet: boolean = false;

  native: boolean = false;

  options: Object = {};

  constructor(options?: Object = {}) {
    this.options = { ...options };
  }

  /**
   * Transform the unified or native syntax using the registered adapter.
   */
  transform<T: Object>(styleName: string, statement: T): StyleSheet {
    throw new Error(`${this.constructor.name} must define the \`transform\` method.`);
  }
}
