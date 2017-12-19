/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import createStyleElement from 'aesthetic/lib/helpers/createStyleElement';
import { createRenderer, combineRules } from 'fela';
import { render } from 'fela-dom';

import type { Renderer } from 'fela';
import type { StyleDeclaration } from '../../types';

export default class FelaAdapter extends Adapter {
  fela: Renderer;

  constructor(fela?: Renderer, options?: Object = {}) {
    super(options);

    this.fela = fela || createRenderer();

    render(this.fela, createStyleElement('fela'));
  }

  transform(styles: StyleDeclaration[]): string {
    return this.fela.renderRule(combineRules(...styles));
  }
}
