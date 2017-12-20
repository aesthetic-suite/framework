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

type SelectorCallback = (selector: string) => mixed;
type SelectorHandler = (
    selector: string,
    baseSelector: string,
    callback: SelectorCallback,
) => string | null;
type Extension = { selectorHandler: SelectorHandler };

export default class AphroditeAdapter extends Adapter {
  aphrodite: Object = {};

  constructor(extensions?: Extension[] = [], options?: Object = {}) {
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
    return this.aphrodite.css(...styles);
  }

  handleGlobalSelector(
    selector: string,
    baseSelector: string,
    callback: SelectorCallback,
  ): string | null {
    if (selector.charAt(0) !== '*') {
      return null;
    }

    return callback(selector.slice(1));
  }
}
