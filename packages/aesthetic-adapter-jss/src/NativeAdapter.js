/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import JSS, { create } from 'jss';

import type { TransformedDeclarations } from '../../types';

export default class JSSAdapter extends Adapter {
  jss: JSS;

  constructor(jss: JSS, options?: Object = {}) {
    super(options);

    this.jss = jss || create();
  }

  transform<S: Object>(styleName: string, declarations: S): TransformedDeclarations {
    if (__DEV__) {
      if (this.native) {
        throw new Error('JSS does not support React Native.');
      }
    }

    const styleSheet = this.jss.createStyleSheet(declarations, {
      meta: styleName,
      named: true,
      ...this.options,
    }).attach();

    return { ...styleSheet.classes };
  }
}
