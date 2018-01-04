/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import JSS, { create } from 'jss';

import type {
  ClassName,
  StyleDeclaration,
  StyleSheet,
} from '../../types';

export default class JSSAdapter extends Adapter {
  jss: JSS;

  constructor(jss?: JSS, options?: Object = {}) {
    super(options);

    this.jss = jss || create();
  }

  create(styleSheet: StyleSheet, styleName: string): StyleSheet {
    this.sheet = this.jss.createStyleSheet(styleSheet, {
      classNamePrefix: styleName ? `${styleName}-` : '',
      media: 'screen',
      meta: { styleName },
    }).attach();

    return this.sheet.classes;
  }

  transform(...styles: StyleDeclaration[]): ClassName {
    return styles.filter(style => typeof style === 'string').join(' ');
  }
}
