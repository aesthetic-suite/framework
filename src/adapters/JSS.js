/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Jss, { create, StyleSheet } from 'jss';
import Adapter from '../Adapter';

import type { JssOptions, Plugin } from 'jss';
import type { StyleDeclarationMap, ClassNameMap } from '../types';

export default class JSSAdapter extends Adapter {
  jss: Jss;
  sheets: { [key: string]: StyleSheet };

  constructor(options: JssOptions | Plugin[] = {}) {
    super();

    if (Array.isArray(options)) {
      options = { plugins: options };
    }

    this.jss = create(options);
  }

  /**
   * {@inheritDoc}
   */
  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
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

  /**
   * {@inheritDoc}
   */
  clear(styleName: string) {
    const sheet = this.sheets[styleName];

    if (sheet) {
      sheet.detach();

      return true;
    }

    return false;
  }
}
