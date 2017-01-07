/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import createStyleElement from 'aesthetic/lib/helpers/createStyleElement';
import { createRenderer } from 'fela';
import { render } from 'fela-dom';

import type { StyleDeclarationMap, ClassNameMap } from 'aesthetic';
import type { Renderer, RendererConfig } from 'fela';

export default class FelaAdapter extends Adapter {
  fela: Renderer;

  constructor(config: RendererConfig = {}) {
    super();

    this.styleTag = createStyleElement('fela');
    this.fela = createRenderer(config);

    if (this.styleTag) {
      render(this.fela, this.styleTag);
    }
  }

  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    const classNames = {};

    Object.keys(declarations).forEach((setName: string) => {
      classNames[setName] = this.fela.renderRule(() => declarations[setName]);
    });

    return classNames;
  }
}
