/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Adapter, ClassName, UnifiedSyntax, FontFace, Keyframes, injectKeyframes } from 'aesthetic';
import { createRenderer, combineRules, IRenderer } from 'fela';
import { render } from 'fela-dom';
import { StyleSheet, Declaration } from './types';

export default class FelaAdapter extends Adapter<StyleSheet, Declaration> {
  fela: IRenderer;

  keyframesCache: { [animationName: string]: string } = {};

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

  unify(syntax: UnifiedSyntax<StyleSheet, Declaration>) {
    syntax
      .on('property', this.handleProperty)
      .on('@charset', syntax.createUnsupportedHandler('@charset'))
      .on('@font-face', this.handleFontFace)
      .on('@global', this.handleGlobal)
      .on('@import', syntax.createUnsupportedHandler('@import'))
      .on('@keyframes', this.handleKeyframe)
      .on('@namespace', syntax.createUnsupportedHandler('@namespace'))
      .on('@page', syntax.createUnsupportedHandler('@page'))
      .on('@viewport', syntax.createUnsupportedHandler('@viewport'));
  }

  // http://fela.js.org/docs/basics/Fonts.html
  // http://fela.js.org/docs/basics/Renderer.html#renderfont
  handleFontFace = (
    styleSheet: StyleSheet,
    fontFaces: FontFace[],
    fontFamily: string,
    srcPaths: string[][],
  ) => {
    fontFaces.map((face, i) => this.fela.renderFont(fontFamily, srcPaths[i], face));
  };

  // http://fela.js.org/docs/advanced/StaticStyle.html
  // http://fela.js.org/docs/api/fela/Renderer.html#renderstaticstyle-selector
  handleGlobal = (styleSheet: StyleSheet, declaration: Declaration, selector: string) => {
    this.fela.renderStatic(declaration, selector);
  };

  // http://fela.js.org/docs/basics/Keyframes.html
  // http://fela.js.org/docs/basics/Renderer.html#renderkeyframe
  handleKeyframe = (styleSheet: StyleSheet, keyframes: Keyframes, animationName: string) => {
    this.keyframesCache[animationName] = this.fela.renderKeyframe(() => keyframes);
  };

  handleProperty = (declaration: Declaration, value: any, property: string) => {
    if (property === 'animationName') {
      declaration[property] = injectKeyframes(value, this.keyframesCache).join(', ');
    } else {
      declaration[property] = style;
    }
  };
}
