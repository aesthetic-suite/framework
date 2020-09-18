/* eslint-disable unicorn/prefer-modern-dom-apis */

import getStyleElement from './getStyleElement';
import { SheetType } from '../types';

// Elements should be in the order of: global, standard, conditions
function insertInOrder(type: SheetType, style: HTMLStyleElement) {
  const standard = getStyleElement('standard');
  const conditions = getStyleElement('conditions');

  if (type === 'global' && (standard || conditions)) {
    (standard || conditions)!.insertAdjacentElement('beforebegin', style);
  } else if (type === 'standard' && conditions) {
    conditions.insertAdjacentElement('beforebegin', style);
  } else if (type === 'conditions' && standard) {
    standard.insertAdjacentElement('afterend', style);
  } else {
    document.head.append(style);
  }
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
