/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UnifiedSyntax from 'aesthetic/unified';
import AphroditeAdapter from './NativeAdapter';

import type { AtRule, Statement, StyleSheet } from '../../types';

export default class UnifiedAphroditeAdapter extends AphroditeAdapter {
  syntax: UnifiedSyntax;

  constructor(aphrodite: Object, options?: Object = {}) {
    super(aphrodite, options);

    this.syntax = new UnifiedSyntax();
    this.syntax
      .on('@charset', this.createUnsupportedHandler('@charset'))
      .on('@document', this.createUnsupportedHandler('@document'))
      .on('@fallbacks', this.createUnsupportedHandler('@fallbacks'))
      .on('@import', this.createUnsupportedHandler('@import'))
      .on('@namespace', this.createUnsupportedHandler('@namespace'))
      .on('@page', this.createUnsupportedHandler('@page'))
      .on('@supports', this.createUnsupportedHandler('@supports'))
      .on('@viewport', this.createUnsupportedHandler('@viewport'));
  }

  transform(styleName: string, statement: Statement): StyleSheet {
    return super.transform(styleName, this.syntax.convert(statement));
  }

  createUnsupportedHandler(rule: AtRule): () => void {
    return () => {
      throw new Error(`Aphrodite does not support ${rule}.`);
    };
  }
}
