/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Adapter, ClassName, UnifiedSyntax, injectKeyframes, injectFontFaces } from 'aesthetic';
import { StyleSheet as Aphrodite, Extension } from 'aphrodite';
import { StyleSheet, ParsedStyleSheet, Declaration, ParsedDeclaration } from './types';

export default class AphroditeAdapter extends Adapter<
  StyleSheet,
  Declaration,
  ParsedStyleSheet,
  ParsedDeclaration
> {
  aphrodite: {
    css(...styles: ParsedDeclaration[]): ClassName;
    StyleSheet: typeof Aphrodite;
  };

  constructor(extensions: Extension[] = []) {
    super();

    this.aphrodite = Aphrodite.extend([
      ...extensions,
      { selectorHandler: this.handleHierarchySelector },
      { selectorHandler: this.handleGlobalSelector },
    ]);
  }

  create(styleSheet: StyleSheet): ParsedStyleSheet {
    return this.aphrodite.StyleSheet.create(styleSheet) as ParsedStyleSheet;
  }

  transform(...styles: ParsedDeclaration[]): ClassName {
    const legitStyles: ParsedDeclaration[] = [];
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
      legitStyles.push(...Object.values(this.create(tempStylesheet)));
    }

    return this.aphrodite.css(...legitStyles);
  }

  unify(syntax: UnifiedSyntax<StyleSheet, Declaration>) {
    syntax
      .on('property', this.handleProperty)
      .on('@charset', syntax.createUnsupportedHandler('@charset'))
      .on('@fallbacks', syntax.createUnsupportedHandler('@fallbacks'))
      .on('@global', this.handleGlobal)
      .on('@import', syntax.createUnsupportedHandler('@import'))
      .on('@namespace', syntax.createUnsupportedHandler('@namespace'))
      .on('@page', syntax.createUnsupportedHandler('@page'))
      .on('@supports', syntax.createUnsupportedHandler('@supports'))
      .on('@viewport', syntax.createUnsupportedHandler('@viewport'))
      .off('@font-face')
      .off('@keyframes');
  }

  handleGlobal(styleSheet: StyleSheet, declaration: Declaration, selector: string) {
    styleSheet.globals = {
      ...styleSheet.globals,
      [`*${selector}`]: declaration,
    };
  }

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

  handleProperty(declaration: Declaration, value: any, property: string) {
    if (property === 'animationName') {
      declaration[property] = injectKeyframes(value, this.unifiedSyntax!.keyframes);
    } else if (property === 'fontFamily') {
      declaration[property] = injectFontFaces(value, this.unifiedSyntax!.fontFaces);
    } else {
      declaration[property] = value;
    }
  }
}
