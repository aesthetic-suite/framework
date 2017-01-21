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
import type { StyleDeclarationMap, TransformedStylesMap } from '../../types';

export default class FelaAdapter extends Adapter {
  fela: Renderer;

  constructor(fela: Renderer, options: Object = {}) {
    super(options);

    this.fela = fela || createRenderer();

    render(this.fela, createStyleElement('fela'));
  }

  transform(styleName: string, declarations: StyleDeclarationMap): TransformedStylesMap {
    const output = {};

    Object.keys(declarations).forEach((setName: string) => {
      const value = declarations[setName];

      if (typeof value === 'string') {
        output[setName] = this.native ? {} : value;
      } else {
        output[setName] = this.fela.renderRule(() => value);
      }
    });

    return output;
  }
}
