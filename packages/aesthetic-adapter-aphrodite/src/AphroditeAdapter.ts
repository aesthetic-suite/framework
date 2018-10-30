/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import {
  Adapter,
  ClassName,
  Declaration,
  UnifiedSyntax,
  injectKeyframes,
  injectFontFaces,
  StyleSheetMap,
} from 'aesthetic';
import { StyleSheet as Aphrodite, Extension } from 'aphrodite';
import { NativeDeclaration as Properties, ParsedDeclaration } from './types';

export default class AphroditeAdapter extends Adapter<ParsedDeclaration> {
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

  bootstrap(syntax: UnifiedSyntax<Properties>) {
    syntax.on('property', this.handleProperty); //.on('@global', this.handleGlobal);
  }

  createStyleSheet(styleSheet: any): StyleSheetMap<ParsedDeclaration> {
    return this.aphrodite.StyleSheet.create(styleSheet) as StyleSheetMap<ParsedDeclaration>;
  }

  transformToClassName(...styles: ParsedDeclaration[]): ClassName {
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

  handleProperty(declaration: Declaration<Properties>, property: string, value: any) {
    if (property === 'animationName') {
      declaration[property] = injectKeyframes(value, this.unifiedSyntax!.keyframes);
    } else if (property === 'fontFamily') {
      declaration[property] = injectFontFaces(value, this.unifiedSyntax!.fontFaces);
    } else {
      declaration.addProperty(property, value);
    }
  }
}
