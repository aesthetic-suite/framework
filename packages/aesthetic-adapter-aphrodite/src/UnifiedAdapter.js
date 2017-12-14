/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UnifiedSyntax from 'aesthetic/unified';
import AphroditeAdapter from './NativeAdapter';

import type { Statement, StyleSheet } from '../../types';

export default class UnifiedAphroditeAdapter extends AphroditeAdapter {
  syntax: UnifiedSyntax;

  constructor(aphrodite?: Object, options?: Object = {}) {
    super(aphrodite, options);

    this.syntax = new UnifiedSyntax();
    this.syntax
      .on('@charset', this.syntax.createUnsupportedHandler('@charset'))
      .on('@document', this.syntax.createUnsupportedHandler('@document'))
      .on('@fallbacks', this.syntax.createUnsupportedHandler('@fallbacks'))
      .on('@import', this.syntax.createUnsupportedHandler('@import'))
      .on('@namespace', this.syntax.createUnsupportedHandler('@namespace'))
      .on('@page', this.syntax.createUnsupportedHandler('@page'))
      .on('@supports', this.syntax.createUnsupportedHandler('@supports'))
      .on('@viewport', this.syntax.createUnsupportedHandler('@viewport'))
      .off('@font-face')
      .off('@keyframes');
  }

  transform(styleName: string, statement: Statement): StyleSheet {
    return super.transform(styleName, this.syntax.convert(statement));
  }
}
