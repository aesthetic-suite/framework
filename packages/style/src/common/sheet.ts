import { SheetMap, SheetManager } from '@aesthetic/types';
import { isAtRule, isImportRule, insertAtRule, insertImportRule, insertRule } from './helpers';

export function createSheetManager(sheets: SheetMap): SheetManager {
  return {
    insertRule(rule, options, index) {
      const sheet =
        sheets[options.type || (options.media || options.supports ? 'conditions' : 'standard')];

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
