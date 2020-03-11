/* eslint-disable unicorn/prefer-modern-dom-apis */

import getStyleElement from './getStyleElement';
import { SheetType } from '../types';

// Elements should be in the order of: global, standard, media
function insertInOrder(type: SheetType, style: HTMLStyleElement) {
  if (type === 'global') {
    const standard = getStyleElement('standard');
    const conditions = getStyleElement('conditions');

    if (standard || conditions) {
      (standard || conditions)!.insertAdjacentElement('beforebegin', style);

      return;
    }
  }

  if (type === 'standard') {
    const conditions = getStyleElement('conditions');

    if (conditions) {
      conditions.insertAdjacentElement('beforebegin', style);

      return;
    }
  }

  if (type === 'conditions') {
    const standard = getStyleElement('standard');

    if (standard) {
      standard.insertAdjacentElement('afterend', style);

      return;
    }
  }

  document.head.append(style);
}

export default function getDocumentStyleSheet(type: SheetType): CSSStyleSheet {
  let element = getStyleElement(type);

  if (!element) {
    const style = document.createElement('style');
    style.setAttribute('id', `aesthetic-${type}`);
    style.setAttribute('type', 'text/css');
    style.setAttribute('media', 'screen');
    style.setAttribute('data-aesthetic-type', type);

    insertInOrder(type, style);
    element = style;
  }

  return (element as HTMLStyleElement).sheet as CSSStyleSheet;
}
