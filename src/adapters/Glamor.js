/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { css } from 'glamor';
import Adapter from '../Adapter';

import type { ComponentDeclarations, ClassNames } from '../types';

export default class GlamorAdapter extends Adapter {
  transform(styleName: string, declarations: ComponentDeclarations): ClassNames {
    let sheet = this.sheets[styleName];

    if (!sheet) {
      sheet = {};

      Object.keys(declarations).forEach((setName) => {
        sheet[setName] = String(css(declarations[setName]));
      });

      this.sheets[styleName] = sheet;
    }

    return { ...sheet };
  }
}
