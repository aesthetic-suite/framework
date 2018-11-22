/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Aesthetic, { AestheticOptions, ClassName, Ruleset, Sheet, StyleSheetMap } from 'aesthetic';
import { StyleSheet as Aphrodite, Extension } from 'aphrodite';
import { NativeBlock, ParsedBlock } from './types';

export default class AphroditeAesthetic<Theme> extends Aesthetic<Theme, NativeBlock, ParsedBlock> {
  aphrodite: {
    css(...styles: ParsedBlock[]): ClassName;
    StyleSheet: typeof Aphrodite;
  };

  fontFaces: { [fontFamily: string]: NativeBlock[] } = {};

  keyframes: { [animationName: string]: NativeBlock } = {};

  constructor(extensions: Extension[] = [], options: Partial<AestheticOptions> = {}) {
    super(options);

    this.aphrodite = Aphrodite.extend([
      ...extensions,
      { selectorHandler: this.handleHierarchySelector },
      { selectorHandler: this.handleGlobalSelector },
    ]);

    this.syntax
      .on('attribute', this.handleNested)
      .on('font-face', this.handleFontFace)
      .on('global', this.handleGlobal)
      .on('keyframe', this.handleKeyframe)
      .on('media', this.handleMedia)
      .on('property', this.handleProperty)
      .on('pseudo', this.handleNested)
      .on('selector', this.handleNested);
  }

  protected processStyleSheet(styleSheet: object): StyleSheetMap<ParsedBlock> {
    return this.aphrodite.StyleSheet.create(styleSheet) as StyleSheetMap<ParsedBlock>;
  }

  protected transformToClassName(styles: (NativeBlock | ParsedBlock)[]): ClassName {
    const legitStyles: ParsedBlock[] = [];
    const tempStylesheet: { [key: string]: NativeBlock } = {};
    let counter = 0;

    styles.forEach(style => {
      // eslint-disable-next-line no-underscore-dangle
      if (style._name && style._definition) {
        legitStyles.push(style as ParsedBlock);
      } else {
        tempStylesheet[`inline-${counter}`] = style;
        counter += 1;
      }
    });

    if (counter > 0) {
      legitStyles.push(...Object.values(this.processStyleSheet(tempStylesheet)));
    }

    return this.aphrodite.css(...legitStyles);
  }

  // https://github.com/Khan/aphrodite#font-faces
  private handleFontFace = (
    sheet: Sheet<NativeBlock>,
    fontFaces: Ruleset<NativeBlock>[],
    fontFamily: string,
  ) => {
    this.fontFaces[fontFamily] = fontFaces.map(face => face.toObject());
  };

  private handleGlobal = (
    sheet: Sheet<NativeBlock>,
    selector: string,
    ruleset: Ruleset<NativeBlock>,
  ) => {
    const current: Ruleset<NativeBlock> = sheet.ruleSets.globals || sheet.createRuleset('globals');

    current.addNested(`*${selector}`, ruleset);

    sheet.addRuleset(current);
  };

  private handleGlobalSelector(
    selector: string,
    baseSelector: string,
    callback: (selector: string) => string,
  ): string | null {
    if (selector.charAt(0) !== '*') {
      return null;
    }

    return callback(selector.slice(1));
  }

  private handleHierarchySelector(
    selector: string,
    baseSelector: string,
    callback: (selector: string) => string,
  ): string | null {
    if (selector.charAt(0) === '>') {
      return callback(`${baseSelector} ${selector}`);
    }

    if (selector.charAt(0) === '[') {
      return callback(`${baseSelector}${selector}`);
    }

    return null;
  }

  // https://github.com/Khan/aphrodite#animations
  private handleKeyframe = (
    sheet: Sheet<NativeBlock>,
    keyframe: Ruleset<NativeBlock>,
    animationName: string,
  ) => {
    this.keyframes[animationName] = keyframe.toObject();
  };

  // https://github.com/Khan/aphrodite#api
  private handleMedia = (
    ruleset: Ruleset<NativeBlock>,
    query: string,
    value: Ruleset<NativeBlock>,
  ) => {
    ruleset.addNested(`@media ${query}`, value);
  };

  // https://github.com/Khan/aphrodite#api
  private handleNested = (
    ruleset: Ruleset<NativeBlock>,
    selector: string,
    value: Ruleset<NativeBlock>,
  ) => {
    ruleset.addNested(selector, value);
  };

  // https://github.com/Khan/aphrodite#api
  private handleProperty = (ruleset: Ruleset<NativeBlock>, name: keyof NativeBlock, value: any) => {
    if (name === 'animationName') {
      ruleset.addProperty(name, this.syntax.injectKeyframes(value, this.keyframes));
    } else if (name === 'fontFamily') {
      ruleset.addProperty(name, this.syntax.injectFontFaces(value, this.fontFaces));
    } else {
      ruleset.addProperty(name, value);
    }
  };
}
