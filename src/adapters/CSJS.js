/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import csjs from 'csjs';
import Adapter from '../Adapter';

import type { StyleDeclarationMap, ClassNameMap } from '../types';

export default class CSJSAdapter extends Adapter {
  sheets: { [key: string]: Object };

  /**
   * {@inheritDoc}
   */
  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    if (typeof declarations !== 'string') {
      throw new TypeError('CSJS requires the CSS declaration to be a string.');
    }

    let sheet = this.sheets[styleName];

    if (!sheet) {
      this.sheets[styleName] = sheet = csjs()(declarations);
    }

    return { ...sheet };
  }
}
