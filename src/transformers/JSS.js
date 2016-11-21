/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { create } from 'jss';
import type { StyleDeclarationMap, ClassNameMap } from '../types';

export default class JSSTransformer {
  constructor(options = {}) {
    super();

    if (Array.isArray(options)) {
      options = { plugins: options };
    }

    this.jss = create(options);
    this.sheets = {};
  }

  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    let sheet = this.sheets[styleName];

    if (!sheet) {
      this.sheets[styleName] = sheet = this.jss.createStyleSheet(declarations, {
        named: true,
        meta: styleName,
      }).attach();
    }

    return {
      ...sheet.classes,
    };
  }

  purge(styleName: string) {
    const sheet = this.sheets[styleName];

    if (sheet) {
      sheet.detach();
    }
  }
}
