/* eslint-disable unicorn/import-index */

import { CSS } from '@aesthetic/types';
import { getDocumentStyleSheet } from './helpers';
// import { SheetType, getDocumentStyleSheet } from './index';
import createCacheManager from './next/cache';
import createEngine from './next/engine';
import createSheetManager, { createStyleElements } from './next/sheet';
import { CacheManager, Engine, EngineOptions, SheetManager, SheetType, StyleRule } from './types';

export function createTestCacheManager(): CacheManager {
  return createCacheManager();
}

export function createTestSheetManager(): SheetManager {
  return createSheetManager(createStyleElements());
}

export function createTestStyleEngine(options: Partial<EngineOptions>): Engine {
  return createEngine({
    cacheManager: createTestCacheManager(),
    sheetManager: createTestSheetManager(),
    ...options,
  });
}

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
