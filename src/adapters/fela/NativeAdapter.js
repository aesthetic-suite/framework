/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { createRenderer } from 'fela';
import { render } from 'fela-dom';
import Adapter from '../../Adapter';
import createStyleElement from '../../utils/createStyleElement';

import type { Renderer, RendererConfig } from 'fela';
import type { StyleDeclarationMap, ClassNameMap } from '../../types';

export default class FelaAdapter extends Adapter {
  fela: Renderer;

  constructor(config: RendererConfig = {}) {
    super();

    this.fela = createRenderer(config);

    render(this.fela, createStyleElement('fela'));
  }

  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    const classNames = {};

    Object.keys(declarations).forEach((setName: string) => {
      const value = declarations[setName];

      if (typeof value === 'string') {
        classNames[setName] = value;
      } else {
        classNames[setName] = this.fela.renderRule(() => value);
      }
    });

    return classNames;
  }
}
