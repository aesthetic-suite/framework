/* eslint-disable unicorn/import-index, no-unused-expressions */

import { CSS } from '@aesthetic/types';
import { SheetType, getDocumentStyleSheet, getStyleElement } from './index';

export function getRenderedStyles(type: SheetType): CSS {
  return Array.from(getDocumentStyleSheet(type).cssRules).reduce(
    (css, rule) => css + rule.cssText,
    '',
  );
}

export function purgeStyles(type?: SheetType): void {
  if (type) {
    // This is the only way to generate accurate snapshots.
    // It may slow down tests though?
    getStyleElement(type)?.remove();
  } else {
    purgeStyles('global');
    purgeStyles('standard');
    purgeStyles('conditions');
  }
}
