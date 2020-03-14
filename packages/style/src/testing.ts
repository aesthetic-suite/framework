/* eslint-disable unicorn/import-index, no-unused-expressions */

import { SheetType, getDocumentStyleSheet, getStyleElement } from './index';

export function getRenderedStyles(type: SheetType): string {
  return Array.from(getDocumentStyleSheet(type).cssRules).reduce(
    (css, rule) => css + rule.cssText,
    '',
  );
}

export function purgeStyles(type: SheetType) {
  // This is the only way to generate accurate snapshots.
  // It may slow down tests though?
  getStyleElement(type)?.remove();
}
