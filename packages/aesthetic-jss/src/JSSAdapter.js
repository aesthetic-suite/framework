/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import JSS, { create } from 'jss';
import deepMerge from 'lodash.merge';

import type { StyleDeclarations, ClassNames } from '../../types';

type StyleSheetOptions = {
  element?: Object,
  index?: number,
  media?: string,
  meta?: string,
  named?: boolean,
  virtual?: boolean,
};

export default class JSSAdapter extends Adapter {
  jss: JSS;
  options: StyleSheetOptions;
  pseudoPrefix: string = '&';

  constructor(jss: JSS, options: StyleSheetOptions = {}) {
    super();

    this.jss = jss || create();
    this.options = options;
  }

  extractMediaQuery(query: string, properties: CSSStyle, fromScope: string): CSSStyle {
    if (fromScope === Adapter.GLOBAL) {
      this.mediaQueries[query] = properties;
    } else {
      // TODO Move media queries from local to global
    }

    return null;
  }

  transform(styleName: string, declarations: StyleDeclarations): ClassNames {
    const styleSheet = this.jss.createStyleSheet(declarations, {
      named: true,
      meta: styleName,
      ...this.options,
    }).attach();

    return { ...styleSheet.classes };
  }
}
