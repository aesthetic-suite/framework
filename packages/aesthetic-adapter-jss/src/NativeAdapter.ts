/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Adapter, ClassName } from 'aesthetic';
import { JSS, CreateStyleSheetOptions, create } from 'jss';
import { StyleSheet, Declaration } from './types';

export default class JSSAdapter extends Adapter<StyleSheet, Declaration> {
  jss: JSS;

  options: CreateStyleSheetOptions;

  constructor(jss: JSS, options: CreateStyleSheetOptions = {}) {
    super();

    this.jss = jss || create();
    this.options = options;
  }

  create(styleSheet: any, styleName: string): StyleSheet {
    const sheet = this.jss
      .createStyleSheet(styleSheet, {
        media: 'screen',
        ...this.options,
        meta: styleName,
        classNamePrefix: styleName ? `${styleName}-` : '',
      })
      .attach();

    return sheet.classes;
  }

  transform(...styles: Declaration[]): ClassName {
    const legitStyles: (string | Declaration)[] = [];
    const tempStylesheet: { [key: string]: Declaration } = {};
    let counter = 0;

    styles.forEach(style => {
      if (typeof style === 'string') {
        legitStyles.push(style);
      } else if (typeof style === 'object' && style && Object.keys(style).length > 0) {
        tempStylesheet[`inline${counter}`] = style;
        counter += 1;
      }
    });

    if (counter > 0) {
      legitStyles.push(...Object.values(this.create(tempStylesheet, '@dynamic')));
    }

    return legitStyles.join(' ');
  }
}
