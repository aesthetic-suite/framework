/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Aesthetic, { AestheticOptions, ClassName, Keyframes, Ruleset, Sheet } from 'aesthetic';
import { createRenderer, combineRules, IRenderer } from 'fela';
import { render } from 'fela-dom';
import { NativeBlock, ParsedBlock } from './types';

export default class FelaAesthetic<Theme> extends Aesthetic<Theme, NativeBlock, ParsedBlock> {
  fela: IRenderer;

  keyframes: { [animationName: string]: ClassName } = {};

  constructor(fela?: IRenderer, options: Partial<AestheticOptions> = {}) {
    super(options);

    this.fela = fela || createRenderer();

    this.syntax
      .on('attribute', this.handleNested)
      .on('fallback', this.handleFallback)
      .on('font-face', this.handleFontFace)
      .on('global', this.handleGlobal)
      .on('keyframes', this.handleKeyframes)
      .on('media', this.handleMedia)
      .on('property', this.handleProperty)
      .on('pseudo', this.handleNested)
      .on('selector', this.handleNested)
      .on('supports', this.handleSupports);

    render(this.fela);
  }

  // https://github.com/rofrischmann/fela/tree/master/packages/fela-plugin-fallback-value
  handleFallback = (ruleset: Ruleset<NativeBlock>, name: keyof NativeBlock, value: any[]) => {
    let fallbacks: any = ruleset.properties[name] || [];

    if (!Array.isArray(fallbacks)) {
      fallbacks = [fallbacks];
    }

    ruleset.addProperty(name, [...fallbacks, ...value]);
  };

  // http://fela.js.org/docs/basics/Fonts.html
  // http://fela.js.org/docs/api/fela/Renderer.html
  handleFontFace = (
    sheet: Sheet<NativeBlock>,
    fontFaces: NativeBlock[],
    fontFamily: string,
    srcPaths: string[][],
  ) => {
    fontFaces.map((face, i) => {
      const { local, ...style } = face as any;

      this.fela.renderFont(fontFamily, srcPaths[i], {
        ...style,
        localAlias: local,
      });
    });
  };

  // http://fela.js.org/docs/advanced/StaticStyle.html
  // http://fela.js.org/docs/api/fela/Renderer.html#renderstaticstyle-selector
  handleGlobal = (sheet: Sheet<NativeBlock>, selector: string, ruleset: Ruleset<NativeBlock>) => {
    this.fela.renderStatic(ruleset.toObject(), selector);
  };

  // http://fela.js.org/docs/basics/Keyframes.html
  // http://fela.js.org/docs/basics/Renderer.html#renderkeyframe
  handleKeyframes = (
    sheet: Sheet<NativeBlock>,
    keyframes: Keyframes<NativeBlock>,
    animationName: string,
  ) => {
    this.keyframes[animationName] = this.fela.renderKeyframe(() => keyframes as any, {});
  };

  // http://fela.js.org/docs/basics/Rules.html#3-media-queries
  handleMedia = (ruleset: Ruleset<NativeBlock>, query: string, value: Ruleset<NativeBlock>) => {
    ruleset.addNested(`@media ${query}`, value);
  };

  // http://fela.js.org/docs/basics/Rules.html#style-object
  handleNested = (ruleset: Ruleset<NativeBlock>, selector: string, value: Ruleset<NativeBlock>) => {
    ruleset.addNested(selector, value);
  };

  // http://fela.js.org/docs/basics/Rules.html
  handleProperty = (ruleset: Ruleset<NativeBlock>, name: keyof NativeBlock, value: any) => {
    if (name === 'animationName') {
      ruleset.addProperty(name, this.syntax.injectKeyframes(value, this.keyframes).join(', '));
    } else {
      ruleset.addProperty(name, value);
    }
  };

  // http://fela.js.org/docs/basics/Rules.html
  handleSupports = (ruleset: Ruleset<NativeBlock>, query: string, value: Ruleset<NativeBlock>) => {
    ruleset.addNested(`@supports ${query}`, value);
  };

  transformToClassName(styles: (NativeBlock | ParsedBlock)[]): ClassName {
    return this.fela.renderRule(combineRules(...styles.map(style => () => style)), {});
  }
}
