import {
  Adapter,
  ClassName,
  Ruleset,
  Sheet,
  StyleName,
  SheetMap,
  TransformOptions,
} from 'aesthetic';
import { toArray } from 'aesthetic-utils';
import { Jss, StyleSheet as JSSSheet } from 'jss';
import { NativeBlock, ParsedBlock } from './types';

export default class JSSAdapter extends Adapter<NativeBlock, ParsedBlock> {
  jss: Jss;

  keyframes: { [animationName: string]: string } = {};

  sheets: { [styleName: string]: JSSSheet<string> } = {};

  constructor(jss: Jss) {
    super();

    this.jss = jss;

    this.syntax
      .on('attribute', this.handleNested)
      .on('charset', this.handleCharset)
      .on('css', this.handleCss)
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

  flushStyles(styleName: StyleName) {
    const sheet = this.sheets[styleName];

    if (sheet) {
      sheet.attach();
    }
  }

  isParsedBlock(block: NativeBlock | ParsedBlock): block is ParsedBlock {
    return typeof block === 'string';
  }

  parseStyleSheet(
    styleSheet: SheetMap<NativeBlock>,
    { name, theme }: Required<TransformOptions>,
  ): SheetMap<ParsedBlock> {
    this.sheets[name] = this.jss.createStyleSheet(styleSheet, {
      media: 'screen',
      meta: `${name}-${theme}`,
    });

    // Different themes use the same style name,
    // so we must attach these styles immediately,
    // otherwise other compilations would not attach
    // previous theme styles.
    // TODO: Fix in v6+
    this.sheets[name].attach();

    return this.sheets[name].classes;
  }

  purgeStyles(styleName?: StyleName) {
    if (styleName) {
      if (this.sheets[styleName]) {
        this.sheets[styleName].detach();

        delete this.sheets[styleName];
      }
    } else {
      Object.values(this.sheets).forEach(sheet => {
        sheet.detach();
      });

      this.sheets = {};
    }
  }

  transformToClassName(styles: ParsedBlock[]): ClassName {
    return styles.join(' ');
  }

  // https://github.com/cssinjs/jss/blob/master/packages/jss/tests/integration/sheet.js#L144
  private handleCharset = (sheet: Sheet<NativeBlock>, charset: string) => {
    sheet.addAtRule('@charset', `"${charset}"`);
  };

  private handleCss = (css: string) => {
    this.getStyleSheetManager().injectStatements(css);
  };

  // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#fallbacks
  private handleFallback = (
    ruleset: Ruleset<NativeBlock>,
    name: keyof NativeBlock,
    value: unknown[],
  ) => {
    ruleset.addProperty('fallbacks', [
      ...toArray(ruleset.properties.fallbacks),
      ...value.map(fallback => ({ [name]: fallback })),
    ]);
  };

  // https://github.com/cssinjs/jss/blob/master/docs/json-api.md#font-face
  private handleFontFace = (sheet: Sheet<NativeBlock>, fontFaces: Ruleset<NativeBlock>[]) => {
    const current = (sheet.atRules['@font-face'] as Ruleset<NativeBlock>[]) || [];

    sheet.addAtRule('@font-face', [...current, ...fontFaces]);
  };

  // https://github.com/cssinjs/jss-global
  private handleGlobal = (
    sheet: Sheet<NativeBlock>,
    selector: string,
    ruleset: Ruleset<NativeBlock>,
  ) => {
    const current = (sheet.atRules['@global'] as Sheet<NativeBlock>) || sheet.createSheet();

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
    keyframe: Ruleset<NativeBlock>,
    animationName: string,
  ) => {
    this.keyframes[animationName] = animationName;

    sheet.addAtRule(`@keyframes ${animationName}`, keyframe);
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
