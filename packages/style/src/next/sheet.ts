/* eslint-disable sort-keys */

import { CSS } from '@aesthetic/types';
import { IMPORT_RULE, STYLE_RULE } from '../constants';
import { getDocumentStyleSheet, isAtRule, isImportRule } from '../helpers';
import { SheetMap, SheetManager, StyleRule, SheetType } from '../types';

function insertRule(sheet: StyleRule, rule: CSS, index?: number): number {
  try {
    return sheet.insertRule(rule, index ?? sheet.cssRules.length);
  } catch {
    // Vendor prefixed properties, pseudos, etc, that are inserted
    // into different vendors will trigger a failure. For example,
    // `-moz` or `-ms` being inserted into WebKit.
    // There's no easy way around this, so let's just ignore the
    // error so that subsequent styles are inserted.
    // istanbul ignore next
    return -1;
  }
}

function insertAtRule(sheet: StyleRule, rule: CSS): number {
  const { length } = sheet.cssRules;
  let index = 0;

  // At-rules must be inserted before normal style rules.
  for (let i = 0; i <= length; i += 1) {
    index = i;

    if (sheet.cssRules[i]?.type === STYLE_RULE) {
      break;
    }
  }

  return insertRule(sheet, rule, index);
}

function insertImportRule(sheet: StyleRule, rule: CSS): number {
  const { length } = sheet.cssRules;
  let index = 0;

  // Import rules must be inserted at the top of the style sheet,
  // but we also want to persist the existing order.
  for (let i = 0; i <= length; i += 1) {
    index = i;

    if (sheet.cssRules[i]?.type !== IMPORT_RULE) {
      break;
    }
  }

  return insertRule(sheet, rule, index);
}

function getSheet(type: SheetType): StyleRule {
  return (getDocumentStyleSheet(type) as unknown) as StyleRule;
}

export function createStyleElements(): SheetMap {
  return {
    // Order is important here!
    global: getSheet('global'),
    standard: getSheet('standard'),
    conditions: getSheet('conditions'),
  };
}

export default function createSheetManager(sheets: SheetMap): SheetManager {
  return {
    sheets,
    insertRule(type, rule, index) {
      const sheet = sheets[type];

      if (isImportRule(rule)) {
        return insertImportRule(sheet, rule);
      } else if (isAtRule(rule)) {
        return insertAtRule(sheet, rule);
      }

      return insertRule(sheet, rule, index);
    },
  };
}
