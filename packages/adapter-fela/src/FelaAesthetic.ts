import Aesthetic, { AestheticOptions, ClassName, Ruleset, Sheet } from 'aesthetic';
import { combineRules, IRenderer } from 'fela';
import { render } from 'fela-dom';
import { NativeBlock, ParsedBlock } from './types';

export default class FelaAesthetic<Theme extends object> extends Aesthetic<
  Theme,
  NativeBlock,
  ParsedBlock
> {
  fela: IRenderer;

  keyframes: { [animationName: string]: ClassName } = {};

  constructor(fela: IRenderer, options: Partial<AestheticOptions> = {}) {
    super(options);

    this.fela = fela;

    this.syntax
      .on('attribute', this.handleNested)
      .on('css', this.handleCss)
      .on('fallback', this.handleFallback)
      .on('font-face', this.handleFontFace)
      .on('global', this.handleGlobal)
      .on('keyframe', this.handleKeyframe)
      .on('media', this.handleMedia)
      .on('property', this.handleProperty)
      .on('pseudo', this.handleNested)
      .on('selector', this.handleNested)
      .on('support', this.handleSupport);
  }

  flushStyles() {
    render(this.fela);
  }

  transformToClassName(styles: ParsedBlock[]): ClassName {
    return this.fela.renderRule(combineRules(...styles.map(style => () => style)), {});
  }

  purgeStyles() {
    const elements = document.querySelectorAll('style[data-fela-type]');

    if (elements) {
      Array.from(elements).forEach(element => {
        // eslint-disable-next-line no-param-reassign
        element.textContent = '';
      });
    }
  }

  // http://fela.js.org/docs/api/fela/Renderer.html
  private handleCss = (css: string) => {
    this.fela.renderStatic(css);
  };

  // https://github.com/rofrischmann/fela/tree/master/packages/fela-plugin-fallback-value
  private handleFallback = (
    ruleset: Ruleset<NativeBlock>,
    name: keyof NativeBlock,
    value: any[],
  ) => {
    let fallbacks: any = ruleset.properties[name] || [];

    if (!Array.isArray(fallbacks)) {
      fallbacks = [fallbacks];
    }

    ruleset.addProperty(name, [...value, ...fallbacks]);
  };

  // http://fela.js.org/docs/basics/Fonts.html
  // http://fela.js.org/docs/api/fela/Renderer.html
  private handleFontFace = (
    sheet: Sheet<NativeBlock>,
    fontFaces: Ruleset<NativeBlock>[],
    fontFamily: string,
    srcPaths: string[][],
  ) => {
    fontFaces.forEach((face, i) => {
      const { local, ...style } = face.toObject() as any;

      this.fela.renderFont(fontFamily, srcPaths[i], {
        ...style,
        localAlias: local,
      });
    });
  };

  // http://fela.js.org/docs/advanced/StaticStyle.html
  // http://fela.js.org/docs/api/fela/Renderer.html#renderstaticstyle-selector
  private handleGlobal = (
    sheet: Sheet<NativeBlock>,
    selector: string,
    ruleset: Ruleset<NativeBlock>,
  ) => {
    this.fela.renderStatic(ruleset.toObject(), selector);
  };

  // http://fela.js.org/docs/basics/Keyframes.html
  // http://fela.js.org/docs/basics/Renderer.html#renderkeyframe
  private handleKeyframe = (
    sheet: Sheet<NativeBlock>,
    keyframe: Ruleset<NativeBlock>,
    animationName: string,
  ) => {
    this.keyframes[animationName] = this.fela.renderKeyframe(() => keyframe.toObject() as any, {});
  };

  // http://fela.js.org/docs/basics/Rules.html#3-media-queries
  private handleMedia = (
    ruleset: Ruleset<NativeBlock>,
    query: string,
    value: Ruleset<NativeBlock>,
  ) => {
    ruleset.addNested(`@media ${query}`, value);
  };

  // http://fela.js.org/docs/basics/Rules.html#style-object
  private handleNested = (
    ruleset: Ruleset<NativeBlock>,
    selector: string,
    value: Ruleset<NativeBlock>,
  ) => {
    ruleset.addNested(selector, value);
  };

  // http://fela.js.org/docs/basics/Rules.html
  private handleProperty = (ruleset: Ruleset<NativeBlock>, name: keyof NativeBlock, value: any) => {
    if (name === 'animationName') {
      ruleset.addProperty(name, this.syntax.injectKeyframes(value, this.keyframes).join(', '));
    } else {
      ruleset.addProperty(name, value);
    }
  };

  // http://fela.js.org/docs/basics/Rules.html
  private handleSupport = (
    ruleset: Ruleset<NativeBlock>,
    query: string,
    value: Ruleset<NativeBlock>,
  ) => {
    ruleset.addNested(`@supports ${query}`, value);
  };
}
