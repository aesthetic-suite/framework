/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Aesthetic, {
  AestheticOptions,
  ClassName,
  Keyframes,
  Ruleset,
  Sheet,
  StyleName,
  StyleSheetMap,
} from 'aesthetic';
import { JSS, StyleSheet as JSSSheet } from 'jss';
import { NativeBlock, ParsedBlock } from './types';

export default class JSSAdapter<Theme> extends Aesthetic<Theme, NativeBlock, ParsedBlock> {
  jss: JSS;

  sheets: { [styleName: string]: JSSSheet<any> } = {};

  constructor(jss: JSS, options: Partial<AestheticOptions> = {}) {
    super(options);

    this.jss = jss;

    this.syntax
      .on('attribute', this.handleNested)
      .on('charset', this.handleCharset)
      .on('fallback', this.handleFallback)
      .on('font-face', this.handleFontFace)
      .on('global', this.handleGlobal)
      .on('import', this.handleImport)
      .on('keyframe', this.handleKeyframe)
      .on('media', this.handleMedia)
      .on('property', this.handleProperty)
      .on('pseudo', this.handleNested)
      .on('selector', this.handleNested)
      .on('support', this.handleSupport)
      .on('viewport', this.handleViewport);
  }

  protected processStyleSheet(
    styleSheet: object,
    styleName: StyleName,
  ): StyleSheetMap<ParsedBlock> {
    this.sheets[styleName] = this.jss
      .createStyleSheet<any>(styleSheet, {
        media: 'screen',
        meta: styleName,
        classNamePrefix: `${styleName}-`,
      })
      .attach();

    return this.sheets[styleName].classes;
  }

  protected transformToClassName(styles: (NativeBlock | ParsedBlock)[]): ClassName {
    const legitStyles: ParsedBlock[] = [];
    const tempStylesheet: { [key: string]: NativeBlock } = {};
    let counter = 0;

    styles.forEach(style => {
      if (typeof style === 'string') {
        legitStyles.push(style);
      } else if (typeof style === 'object' && style !== null) {
        tempStylesheet[`inline-${counter}`] = style;
        counter += 1;
      }
    });

    if (counter > 0) {
      legitStyles.push(...Object.values(this.processStyleSheet(tempStylesheet, 'inline-dynamic')));
    }

    return legitStyles.join(' ');
  }

  // https://github.com/cssinjs/jss/blob/master/packages/jss/tests/integration/sheet.js#L144
  private handleCharset = (sheet: Sheet<NativeBlock>, charset: string) => {
    sheet.addAtRule('@charset', charset);
  };

  // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#fallbacks
  private handleFallback = (
    ruleset: Ruleset<NativeBlock>,
    name: keyof NativeBlock,
    value: any[],
  ) => {
    const fallbacks = value.map(fallback => ({ [name]: fallback }));
    const current = ruleset.properties.fallbacks || [];

    ruleset.addProperty('fallbacks', [...current, ...fallbacks]);
  };

  // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#font-face
  private handleFontFace = (sheet: Sheet<NativeBlock>, fontFaces: NativeBlock[]) => {
    const current = (sheet.atRules['@font-face'] as NativeBlock[]) || [];

    sheet.addAtRule('@font-face', [...current, ...fontFaces]);
  };

  // https://github.com/cssinjs/jss-global
  private handleGlobal = (
    sheet: Sheet<NativeBlock>,
    selector: string,
    ruleset: Ruleset<NativeBlock>,
  ) => {
    const current = (sheet.atRules['@global'] as Sheet<NativeBlock>) || new Sheet<NativeBlock>();

    current.addRuleset(ruleset);

    sheet.addAtRule('@global', current);
  };

  // https://github.com/cssinjs/jss/blob/master/packages/jss/tests/integration/sheet.js#L144
  private handleImport = (sheet: Sheet<NativeBlock>, paths: string[]) => {
    sheet.addAtRule('@import', paths);
  };

  // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#keyframes-animation
  private handleKeyframe = (
    sheet: Sheet<NativeBlock>,
    keyframes: Keyframes<NativeBlock>,
    animationName: string,
  ) => {
    sheet.addAtRule(`@keyframes ${animationName}`, keyframes);
  };

  // https://github.com/cssinjs/jss-nested#use-at-rules-inside-of-regular-rules
  private handleMedia = (
    ruleset: Ruleset<NativeBlock>,
    query: string,
    value: Ruleset<NativeBlock>,
  ) => {
    ruleset.addNested(`@media ${query}`, value);
  };

  // https://github.com/cssinjs/jss-nested#use--to-reference-selector-of-the-parent-rule
  private handleNested = (
    ruleset: Ruleset<NativeBlock>,
    selector: string,
    value: Ruleset<NativeBlock>,
  ) => {
    ruleset.addNested(`&${selector}`, value);
  };

  // https://github.com/cssinjs/jss-nested#use--to-reference-selector-of-the-parent-rule
  private handleProperty = (ruleset: Ruleset<NativeBlock>, name: keyof NativeBlock, value: any) => {
    if (name === 'animationName') {
      ruleset.addProperty(name, `$${value}`);
    } else {
      ruleset.addProperty(name, value);
    }
  };

  // https://github.com/cssinjs/jss-nested#use-at-rules-inside-of-regular-rules
  private handleSupport = (
    ruleset: Ruleset<NativeBlock>,
    query: string,
    value: Ruleset<NativeBlock>,
  ) => {
    ruleset.addNested(`@supports ${query}`, value);
  };

  // https://github.com/cssinjs/jss/blob/master/packages/jss/tests/integration/sheet.js#L144
  private handleViewport = (sheet: Sheet<NativeBlock>, ruleset: Ruleset<NativeBlock>) => {
    sheet.addAtRule('@viewport', ruleset);
  };
}
