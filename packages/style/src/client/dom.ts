/* eslint-disable sort-keys */

import { SheetType, StyleRule, SheetMap } from '../index';

export function getStyleElement(type: SheetType): StyleRule {
  let element = document.getElementById(`aesthetic-${type}`) as HTMLStyleElement;

  if (!element) {
    const style = document.createElement('style');
    style.setAttribute('id', `aesthetic-${type}`);
    style.setAttribute('type', 'text/css');
    style.setAttribute('media', 'screen');
    style.setAttribute('data-aesthetic-type', type);

    document.head.append(style);
    element = style;
  }

  return ((element as HTMLStyleElement).sheet as unknown) as StyleRule;
}

export default function createStyleElements(): SheetMap {
  return {
    // Order is important here!
    global: getStyleElement('global'),
    standard: getStyleElement('standard'),
    conditions: getStyleElement('conditions'),
  };
}
