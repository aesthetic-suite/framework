/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import JSS, { create } from 'jss';

import type { Statement, StyleSheet } from '../../types';

export default class JSSAdapter extends Adapter {
  jss: JSS;

  constructor(jss?: JSS, options?: Object = {}) {
    super(options);

    this.jss = jss || create();
  }

  transform(styleName: string, statement: Statement): StyleSheet {
    this.sheet = this.jss.createStyleSheet(statement, {
      meta: styleName,
      named: true,
      ...this.options,
    }).attach();

    return { ...this.sheet.classes };
  }
}
