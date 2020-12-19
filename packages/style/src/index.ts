/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { EngineOptions, VariablesMap } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';
import { createStyleElements, getStyleElement } from './client/dom';
import { hydrateStyles } from './client/hydration';
import { createCacheManager } from './common/cache';
import { createStyleEngine } from './common/engine';
import { createSheetManager } from './common/sheet';
import { formatVariable } from './common/syntax';
import { StyleEngine } from './types';

export * from './common/cache';
export * from './common/constants';
export * from './common/engine';
export * from './common/helpers';
export * from './common/sheet';
export * from './common/syntax';
export * from './types';

export { createStyleElements, getStyleElement };

function setRootVariables(vars: VariablesMap) {
  const root = document.documentElement;

  objectLoop(vars, (value, key) => {
    root.style.setProperty(formatVariable(key), String(value));
  });
}

export function createClientEngine(options: Partial<EngineOptions> = {}): StyleEngine {
  const engine: StyleEngine = createStyleEngine({
    cacheManager: createCacheManager(),
    sheetManager: createSheetManager(createStyleElements()),
    ...options,
  });

  // Will set variables to :root
  engine.setRootVariables = setRootVariables;

  // Attempt to hydrate styles immediately
  hydrateStyles(engine);

  return engine;
}
