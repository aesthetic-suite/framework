/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import JSS, { create } from 'jss';

import type { StyleDeclarations, ClassNames } from '../../types';

export default class JSSAdapter extends Adapter {
  jss: JSS;

  constructor(jss: JSS) {
    super();

    this.jss = jss || create();
  }

  transform(styleName: string, declarations: StyleDeclarations): ClassNames {
    let sheet = this.sheets[styleName];

    if (!sheet) {
      const compiledSheet = this.jss.createStyleSheet(declarations, {
        named: true,
        meta: styleName,
      }).attach();

      this.sheets[styleName] = sheet = {
        sheet: compiledSheet,
        classNames: { ...compiledSheet.classes },
      };
    }

    return { ...sheet.classNames };
  }
}
