/* eslint-disable unicorn/prefer-modern-dom-apis */

import { SheetType } from '../types';

function get(type: SheetType) {
  return document.getElementById(`aesthetic-${type}`);
}

// Elements should be in the order of: global, standard, media
function insertInOrder(type: SheetType, style: HTMLStyleElement) {
  if (type === 'global') {
    const standard = get('standard');
    const conditions = get('conditions');

    if (standard || conditions) {
      (standard || conditions)!.insertAdjacentElement('beforebegin', style);

      return;
    }
  }

  if (type === 'standard') {
    const conditions = get('conditions');

    if (conditions) {
      conditions.insertAdjacentElement('beforebegin', style);

      return;
    }
  }

  if (type === 'conditions') {
    const standard = get('standard');

    if (standard) {
      standard.insertAdjacentElement('afterend', style);

      return;
    }
  }

  document.head.append(style);
}

export default function getDocumentStyleSheet(type: SheetType): CSSStyleSheet {
  let element = get(type);

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
