/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Adapter, ClassName } from 'aesthetic';
import { createRenderer, combineRules, IRenderer } from 'fela';
import { render } from 'fela-dom';
import { StyleSheet, Declaration } from './types';

export default class FelaAdapter extends Adapter<StyleSheet, Declaration> {
  fela: IRenderer;

  constructor(fela?: IRenderer) {
    super();

    this.fela = fela || createRenderer();

    render(this.fela);
  }

  transform(...styles: Declaration[]): ClassName {
    return this.fela.renderRule(
      combineRules(...styles.map(style => (typeof style === 'function' ? style : () => style))),
      {},
    );
  }
}
