/* eslint-disable sort-keys */

// Rollup compatibility
import { SheetType, StyleRule, SheetMap } from '../index';

export function getStyleElement(type: SheetType): StyleRule {
  let element = document.getElementById(`aesthetic-${type}`) as HTMLStyleElement;

  if (!element) {
    element = document.createElement('style');
    element.setAttribute('id', `aesthetic-${type}`);
    element.setAttribute('type', 'text/css');
    element.setAttribute('media', 'screen');
    element.setAttribute('data-aesthetic-type', type);

    document.head.append(element);
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
