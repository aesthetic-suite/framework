/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import JSS, { create } from 'jss';

import type {
  ClassName,
  Statement,
  StyleDeclaration,
  StyleSheet,
} from '../../types';

export default class JSSAdapter extends Adapter {
  jss: JSS;

  constructor(jss?: JSS, options?: Object = {}) {
    super(options);

    this.jss = jss || create();
  }

  create(statement: Statement): StyleSheet {
    this.sheet = this.jss.createStyleSheet(statement).attach();

    return this.sheet.classes;
  }

  transform(...styles: StyleDeclaration[]): ClassName {
    return styles.filter(style => typeof style === 'string').join(' ');
  }
}
