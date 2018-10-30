/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Aesthetic, { AestheticOptions, ClassName, Ruleset, StyleSheetMap } from 'aesthetic';
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

  constructor(extensions: Extension[] = [], options: Partial<AestheticOptions> = {}) {
    super(options);

    this.aphrodite = Aphrodite.extend([
      ...extensions,
      { selectorHandler: this.handleHierarchySelector },
      { selectorHandler: this.handleGlobalSelector },
    ]);
  }

  bootstrap() {
    this.syntax.on('property', this.handleProperty); //.on('@global', this.handleGlobal);
  }

  convertStyleSheet(styleSheet: any): StyleSheetMap<ParsedBlock> {
    return this.aphrodite.StyleSheet.create(styleSheet) as StyleSheetMap<ParsedBlock>;
  }

  transformToClassName(...styles: ParsedBlock[]): ClassName {
    const legitStyles: ParsedBlock[] = [];
    const tempStylesheet: { [key: string]: any } = {};
    let counter = 0;

    styles.forEach(style => {
      // eslint-disable-next-line no-underscore-dangle
      if (style._name && style._definition) {
        legitStyles.push(style);
      } else {
        tempStylesheet[`inline${counter}`] = style;
        counter += 1;
      }
    });

    if (counter > 0) {
      legitStyles.push(...Object.values(this.createStyleSheet(tempStylesheet)));
    }

    return this.aphrodite.css(...legitStyles);
  }

  // handleGlobal(styleSheet: StyleSheet, declaration: Declaration, selector: string) {
  //   styleSheet.globals = {
  //     ...styleSheet.globals,
  //     [`*${selector}`]: declaration,
  //   };
  // }

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

  handleProperty(ruleset: Ruleset<NativeBlock>, property: string, value: any) {
    // if (property === 'animationName') {
    //   declaration[property] = injectKeyframes(value, this.unifiedSyntax!.keyframes);
    // } else if (property === 'fontFamily') {
    //   declaration[property] = injectFontFaces(value, this.unifiedSyntax!.fontFaces);
    // } else {
    //   declaration.addProperty(property, value);
    // }
  }
}
