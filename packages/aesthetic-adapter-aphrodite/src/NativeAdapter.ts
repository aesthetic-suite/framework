/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Adapter, ClassName } from 'aesthetic';
import { StyleSheet as Aphrodite, Extension } from 'aphrodite';
import { StyleSheet, Declaration } from './types';

export default class AphroditeAdapter extends Adapter<StyleSheet, Declaration> {
  aphrodite: {
    css(...styles: Declaration[]): string;
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

  create(styleSheet: any): StyleSheet {
    return this.aphrodite.StyleSheet.create(styleSheet) as StyleSheet;
  }

  transform(...styles: Declaration[]): ClassName {
    const legitStyles: Declaration[] = [];
    const tempStylesheet: { [key: string]: Declaration } = {};
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
}
