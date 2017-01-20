/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import JSS, { create } from 'jss';
import Adapter from '../../Adapter';

import type { StyleSheetOptions } from 'jss';
import type { StyleDeclarationMap, TransformedStylesMap } from '../../types';

export default class JSSAdapter extends Adapter {
  jss: JSS;
  options: StyleSheetOptions;

  constructor(jss: JSS, options: StyleSheetOptions = {}) {
    super();

    this.jss = jss || create();
    this.options = options;
  }

  transform(styleName: string, declarations: StyleDeclarationMap): TransformedStylesMap {
    if (__DEV__) {
      if (this.native) {
        throw new Error('JSS does not support React Native.');
      }
    }

    const styleSheet = this.jss.createStyleSheet(declarations, {
      named: true,
      meta: styleName,
      ...this.options,
    }).attach();

    return { ...styleSheet.classes };
  }
}
