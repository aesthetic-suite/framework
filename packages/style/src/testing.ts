/* eslint-disable unicorn/import-index */

import { CSS } from '@aesthetic/types';
import { SheetType, getDocumentStyleSheet } from './index';
import { StyleRule } from './types';

export function getRenderedStyles(type: SheetType | StyleRule): CSS {
  return Array.from(
    ((typeof type === 'string' ? getDocumentStyleSheet(type) : type) as StyleRule).cssRules,
  ).reduce((css, rule) => css + rule.cssText, '');
}

export function purgeStyles(type?: SheetType): void {
  if (type) {
    // This is the only way to generate accurate snapshots.
    // It may slow down tests though?
    document.getElementById(`aesthetic-${type}`)?.remove();
  } else {
    purgeStyles('global');
    purgeStyles('standard');
    purgeStyles('conditions');
  }
}
