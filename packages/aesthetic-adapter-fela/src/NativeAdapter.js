/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import createStyleElement from 'aesthetic/lib/helpers/createStyleElement';
import { createRenderer } from 'fela';
import { render } from 'fela-dom';

import type { Renderer } from 'fela';
import type { Statement, StyleSheet } from '../../types';

export default class FelaAdapter extends Adapter {
  bypassNativeStyleSheet: boolean = true;

  fela: Renderer;

  constructor(fela?: Renderer, options?: Object = {}) {
    super(options);

    this.fela = fela || createRenderer();

    // React Native does not require a DOM render
    // How to make fela-dom optional though?
    if (this.fela.subscribe) {
      render(this.fela, createStyleElement('fela'));
    }
  }

  transform(styleName: string, statement: Statement): StyleSheet {
    const output = {};

    Object.keys(statement).forEach((selector) => {
      const value = statement[selector];

      if (typeof value === 'string') {
        output[selector] = this.native ? {} : value;
      } else {
        output[selector] = this.fela.renderRule(() => value);
      }
    });

    return output;
  }
}
