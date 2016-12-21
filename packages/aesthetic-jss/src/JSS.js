/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import JSS, { create } from 'jss';

import type { StyleDeclarations, ClassNames } from 'aesthetic';

export default class JSSAdapter extends Adapter {
  jss: JSS;

  constructor(jss: JSS) {
    super();

    this.jss = (jss instanceof JSS) ? jss : create();
  }

  transform(styleName: string, declarations: StyleDeclarations): ClassNames {
    let sheet = this.sheets[styleName];

    if (!sheet) {
      const compiler = this.jss.createStyleSheet(declarations, {
        named: true,
        meta: styleName,
      }).attach();

      this.sheets[styleName] = sheet = { ...compiler.classes };
    }

    return { ...sheet };
  }
}
