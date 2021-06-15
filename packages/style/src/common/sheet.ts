import { SheetManager, SheetMap } from '@aesthetic/types';
import { insertAtRule, insertImportRule, insertRule, isAtRule, isImportRule } from './helpers';

export function createSheetManager(sheets: SheetMap): SheetManager {
	return {
		insertRule(rule, options, index) {
			const sheet =
				sheets[options.type ?? (options.media || options.supports ? 'conditions' : 'standard')];

			if (isImportRule(rule)) {
				return insertImportRule(sheet, rule);
			}

			if (isAtRule(rule)) {
				return insertAtRule(sheet, rule);
			}

			return insertRule(sheet, rule, index);
		},
		sheets,
	};
}
