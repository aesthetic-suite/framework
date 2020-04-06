/* eslint-disable no-underscore-dangle */

import { Adapter, ClassName, Ruleset, Sheet, SheetMap } from 'aesthetic';
import { purgeStyles, toArray } from 'aesthetic-utils';
import { TypeStyle } from 'typestyle';
import { FontFace, KeyFrames } from 'typestyle/lib/types';
import { NativeBlock, ParsedBlock } from './types';

export default class TypeStyleAdapter extends Adapter<NativeBlock, ParsedBlock> {
  typeStyle: TypeStyle;

  keyframes: { [animationName: string]: ClassName } = {};

  constructor(typeStyle: TypeStyle) {
    super();

    this.typeStyle = typeStyle;

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
    this.typeStyle.forceRenderStyles();
  }

  isParsedBlock(block: NativeBlock | ParsedBlock): block is ParsedBlock {
    return typeof block === 'string';
  }

  parseStyleSheet(styleSheet: SheetMap<NativeBlock>): SheetMap<ParsedBlock> {
    return this.typeStyle.stylesheet(styleSheet);
  }

  purgeStyles() {
    // @ts-ignore
    const element: HTMLStyleElement | undefined = this.typeStyle._tag;

    if (element) {
      purgeStyles(element, true);
    }
  }

  transformToClassName(styles: ParsedBlock[]): ClassName {
    return styles.join(' ');
  }

  // https://typestyle.github.io/#/raw/-cssraw-
  private handleCss = (css: string) => {
    this.typeStyle.cssRaw(css);
  };

  // https://typestyle.github.io/#/core/concept-fallbacks
  private handleFallback = (
    ruleset: Ruleset<NativeBlock>,
    name: keyof NativeBlock,
    value: unknown[],
  ) => {
    ruleset.addProperty(name, [...value, ...toArray(ruleset.properties[name] as unknown)]);
  };

  // https://typestyle.github.io/#/raw/fontface
  private handleFontFace = (sheet: Sheet<NativeBlock>, fontFaces: Ruleset<NativeBlock>[]) => {
    fontFaces.forEach(face => {
      this.typeStyle.fontFace(face.toObject() as FontFace);
    });
  };

  // https://typestyle.github.io/#/raw/cssrule
  private handleGlobal = (
    sheet: Sheet<NativeBlock>,
    selector: string,
    ruleset: Ruleset<NativeBlock>,
  ) => {
    this.typeStyle.cssRule(selector, ruleset.toObject());
  };

  // https://typestyle.github.io/#/core/concept-keyframes
  private handleKeyframe = (
    sheet: Sheet<NativeBlock>,
    keyframe: Ruleset<NativeBlock>,
    animationName: string,
  ) => {
    this.keyframes[animationName] = this.typeStyle.keyframes(keyframe.toObject() as KeyFrames);
  };

  // https://typestyle.github.io/#/core/concept-media-queries
  private handleMedia = (
    ruleset: Ruleset<NativeBlock>,
    query: string,
    value: Ruleset<NativeBlock>,
  ) => {
    this.handleNested(ruleset, `@media ${query}`, value);
  };

  // https://typestyle.github.io/#/core/concept-interpolation
  private handleNested = (
    ruleset: Ruleset<NativeBlock>,
    selector: string,
    value: Ruleset<NativeBlock>,
  ) => {
    const nest = ruleset.nested.get('$nest') || ruleset.createRuleset('$nest');

    nest.addNested(selector.startsWith('@') ? selector : `&${selector}`, value);

    ruleset.addNested('$nest', nest);
  };

  // https://typestyle.github.io/#/core
  private handleProperty = (
    ruleset: Ruleset<NativeBlock>,
    name: keyof NativeBlock,
    value: unknown,
  ) => {
    if (name === 'animationName') {
      ruleset.addProperty(
        name,
        this.syntax.injectKeyframes(String(value), this.keyframes).join(', '),
      );
    } else {
      ruleset.addProperty(name, value);
    }
  };

  // https://typestyle.github.io/#/core/concept-media-queries
  private handleSupport = (
    ruleset: Ruleset<NativeBlock>,
    query: string,
    value: Ruleset<NativeBlock>,
  ) => {
    this.handleNested(ruleset, `@supports ${query}`, value);
  };
}