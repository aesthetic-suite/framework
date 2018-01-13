/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { StyleSheet } from 'aphrodite';

import type {
  ClassName,
  StyleDeclaration,
  StyleSheet as AestheticStyleSheet,
} from '../../types';

export default class AphroditeAdapter extends Adapter {
  aphrodite: Object = {};

  constructor(extensions?: Object[] = [], options?: Object = {}) {
    super(options);

    this.aphrodite = StyleSheet.extend([
      ...extensions,
      { selectorHandler: this.handleGlobalSelector },
    ]);
  }

  create(styleSheet: AestheticStyleSheet): AestheticStyleSheet {
    return this.aphrodite.StyleSheet.create(styleSheet);
  }

  transform(...styles: StyleDeclaration[]): ClassName {
    const legitStyles = [];
    const tempStylesheet = {};
    let counter = 0;

    styles.forEach((style, i) => {
      // eslint-disable-next-line no-underscore-dangle
      if (style._name && style._definition) {
        legitStyles.push(style);
      } else {
        tempStylesheet[counter] = style;
        counter += 1;
      }
    });

    if (counter > 0) {
      legitStyles.push(...Object.values(this.create(tempStylesheet)));
    }

    return this.aphrodite.css(...legitStyles);
  }

  handleGlobalSelector(
    selector: string,
    baseSelector: string,
    callback: (selector: string) => string | null,
  ): string | null {
    if (selector.charAt(0) !== '*') {
      return null;
    }

    return callback(selector.slice(1));
  }
}
