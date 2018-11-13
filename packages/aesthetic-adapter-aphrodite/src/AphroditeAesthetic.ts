/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Aesthetic, {
  injectFontFaces,
  injectKeyframes,
  AestheticOptions,
  ClassName,
  Keyframes,
  Ruleset,
  Sheet,
  StyleSheetMap,
} from 'aesthetic';
import { StyleSheet as Aphrodite, Extension } from 'aphrodite';
import { NativeBlock, ParsedBlock } from './types';

export interface AphroditeOptions extends AestheticOptions {
  extensions: Extension[];
}

export default class AphroditeAesthetic<Theme> extends Aesthetic<Theme, NativeBlock, ParsedBlock> {
  aphrodite: {
    css(...styles: ParsedBlock[]): ClassName;
    StyleSheet: typeof Aphrodite;
  };

  fontFaces: { [fontFamily: string]: NativeBlock[] } = {};

  keyframes: { [animationName: string]: Keyframes<NativeBlock> } = {};

  constructor(extensions: Extension[] = [], options: Partial<AestheticOptions> = {}) {
    super(options);

    this.aphrodite = Aphrodite.extend([
      ...extensions,
      { selectorHandler: this.handleHierarchySelector },
      { selectorHandler: this.handleGlobalSelector },
    ]);
  }

  bootstrap() {
    this.syntax
      .on('attribute', this.handleNested)
      .on('font-face', this.handleFontFace)
      .on('global', this.handleGlobal)
      .on('keyframes', this.handleKeyframes)
      .on('media', this.handleMedia)
      .on('property', this.handleProperty)
      .on('pseudo', this.handleNested)
      .on('selector', this.handleNested);
  }

  // https://github.com/Khan/aphrodite#font-faces
  handleFontFace = (sheet: Sheet<NativeBlock>, fontFaces: NativeBlock[], fontFamily: string) => {
    this.fontFaces[fontFamily] = fontFaces;
  };

  handleGlobal = (sheet: Sheet<NativeBlock>, selector: string, ruleset: Ruleset<NativeBlock>) => {
    const current: Ruleset<NativeBlock> = sheet.ruleSets.globals || sheet.createRuleset('globals');

    current.addNested(`*${selector}`, ruleset);

    sheet.addRuleset(current);
  };

  handleGlobalSelector(
    selector: string,
    baseSelector: string,
    callback: (selector: string) => string,
  ): string | null {
    if (selector.charAt(0) !== '*') {
      return null;
    }

    return callback(selector.slice(1));
  }

  handleHierarchySelector(
    selector: string,
    baseSelector: string,
    callback: (selector: string) => string,
  ): string | null {
    if (selector.charAt(0) !== '>' && selector.charAt(0) !== '[') {
      return null;
    }

    return callback(`${baseSelector}${selector}`);
  }

  // https://github.com/Khan/aphrodite#animations
  handleKeyframes = (
    sheet: Sheet<NativeBlock>,
    keyframes: Keyframes<NativeBlock>,
    animationName: string,
  ) => {
    this.keyframes[animationName] = keyframes;
  };

  // https://github.com/Khan/aphrodite#api
  handleMedia = (ruleset: Ruleset<NativeBlock>, query: string, value: Ruleset<NativeBlock>) => {
    ruleset.addNested(`@media ${query}`, value);
  };

  // https://github.com/Khan/aphrodite#api
  handleNested = (ruleset: Ruleset<NativeBlock>, selector: string, value: Ruleset<NativeBlock>) => {
    ruleset.addNested(selector, value);
  };

  // https://github.com/Khan/aphrodite#api
  handleProperty = (ruleset: Ruleset<NativeBlock>, name: keyof NativeBlock, value: any) => {
    if (name === 'animationName') {
      ruleset.addProperty(name, injectKeyframes(value, this.keyframes));
    } else if (name === 'fontFamily') {
      ruleset.addProperty(name, injectFontFaces(value, this.fontFaces));
    } else {
      ruleset.addProperty(name, value);
    }
  };

  processStyleSheet(styleSheet: object): StyleSheetMap<ParsedBlock> {
    return this.aphrodite.StyleSheet.create(styleSheet) as StyleSheetMap<ParsedBlock>;
  }

  transformToClassName(...styles: any[]): ClassName {
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
}