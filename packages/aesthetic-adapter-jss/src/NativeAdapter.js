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
    const legitStyles = [];
    const tempStylesheet = {};
    let counter = 0;

    styles.forEach((style, i) => {
      if (typeof style === 'string') {
        legitStyles.push(style);

      } else if (typeof style === 'object' && style && Object.keys(style).length > 0) {
        tempStylesheet[`inline${counter}`] = style;
        counter += 1;
      }
    });

    if (counter > 0) {
      legitStyles.push(...Object.values(this.create(tempStylesheet, 'dynamic')));
    }

    return legitStyles.join(' ');
  }
}
