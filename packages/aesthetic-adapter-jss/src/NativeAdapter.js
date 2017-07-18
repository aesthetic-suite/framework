/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import JSS, { create } from 'jss';
import Adapter from '../../aesthetic/src/Adapter';

import type { StyleDeclarationMap, TransformedStylesMap } from '../../types';

export default class JSSAdapter extends Adapter {
  jss: JSS;

  constructor(jss: JSS, options: Object = {}) {
    super(options);

    this.jss = jss || create();
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
