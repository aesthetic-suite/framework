import { CacheManager, CSS, EngineOptions, Sheet, SheetManager, SheetType } from '@aesthetic/types';
// Rollup compatibility
import {
	createCacheManager,
	createSheetManager,
	createStyleElements,
	createStyleEngine,
	getStyleElement,
	StyleEngine,
} from './index';

export function createTestCacheManager(): CacheManager {
	return createCacheManager();
}

export function createTestSheetManager(): SheetManager {
	return createSheetManager(createStyleElements());
}

export function createTestStyleEngine(options: Partial<EngineOptions> = {}): StyleEngine {
	return createStyleEngine({
		cacheManager: createTestCacheManager(),
		sheetManager: createTestSheetManager(),
		...options,
	});
}

export function getRenderedStyles(type: Sheet | SheetType): CSS {
	return Array.from((typeof type === 'string' ? getStyleElement(type) : type).cssRules).reduce(
		(css, rule) => css + rule.cssText,
		'',
	);
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
