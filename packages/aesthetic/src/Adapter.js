/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { ClassName, Statement, StyleDeclaration, StyleSheet } from '../../types';

export default class Adapter {
  options: Object = {};

  constructor(options?: Object = {}) {
    this.options = { ...options };
  }

  /**
   * Create a stylesheet from a component's styles statement.
   */
  create(statement: Statement): StyleSheet {
    return (statement: Object);
  }

  /**
   * Transform the unified or native syntax using the registered adapter.
   */
  transform(...styles: StyleDeclaration[]): ClassName {
    throw new Error(`${this.constructor.name} must define the \`transform\` method.`);
  }
}
