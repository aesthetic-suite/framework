import { isAtRule, isImportRule, insertAtRule, insertImportRule, insertRule } from './helpers';
import { SheetMap, SheetManager } from './types';

export function createSheetManager(sheets: SheetMap): SheetManager {
  return {
    insertRule(type, rule, index) {
      const sheet = sheets[type];

      if (isImportRule(rule)) {
        return insertImportRule(sheet, rule);
      } else if (isAtRule(rule)) {
        return insertAtRule(sheet, rule);
      }

      return insertRule(sheet, rule, index);
    },
    sheets,
  };
}
