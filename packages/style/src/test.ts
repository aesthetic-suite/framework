import { CSS, CacheManager, EngineOptions, SheetManager, SheetType, Sheet } from '@aesthetic/types';
import { StyleEngine, createCacheManager, createStyleEngine, createSheetManager } from './index';
import { createStyleElements, getStyleElement } from './client';

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

export function getRenderedStyles(type: SheetType | Sheet): CSS {
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
