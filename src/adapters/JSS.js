/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import JSS, { create, StyleSheet } from 'jss';
import Adapter from '../Adapter';

import type { ComponentDeclarations, ClassNames } from '../types';

export default class JSSAdapter extends Adapter {
  jss: JSS;
  sheets: { [key: string]: StyleSheet };

  constructor(jss: JSS) {
    super();

    this.jss = (jss instanceof JSS) ? jss : create();
    this.sheets = {};
  }

  transform(styleName: string, declarations: ComponentDeclarations): ClassNames {
    let sheet = this.sheets[styleName];

    // Create and cache a new stylesheet
    if (!sheet) {
      this.sheets[styleName] = sheet = this.jss.createStyleSheet(declarations, {
        named: true,
        meta: styleName,
      });
    }

    // Make sure the stylesheet is in the DOM
    sheet.attach();

    return { ...sheet.classes };
  }
}
