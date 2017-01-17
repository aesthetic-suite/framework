/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { createRenderer } from 'fela';
import { render } from 'fela-dom';
import Adapter from '../../Adapter';
import createStyleElement from '../../utils/createStyleElement';

import type { Renderer } from 'fela';
import type { StyleDeclarationMap, ClassNameMap } from '../../types';

export default class FelaAdapter extends Adapter {
  fela: Renderer;

  constructor(fela: Renderer) {
    super();

    this.fela = fela || createRenderer();

    render(this.fela, createStyleElement('fela'));
  }

  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    const output = {};

    Object.keys(declarations).forEach((setName: string) => {
      const value = declarations[setName];

      if (typeof value === 'string') {
        output[setName] = this.nativeSupport ? {} : value;
      } else {
        output[setName] = this.fela.renderRule(() => value);
      }
    });

    return output;
  }
}
