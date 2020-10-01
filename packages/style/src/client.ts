import { Variables } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';
import createStyleElements, { getStyleElement } from './client/dom';
import hydrateStyles from './client/hydration';
// Rollup compatibility
import {
  createCacheManager,
  createStyleEngine,
  createSheetManager,
  formatVariable,
  EngineOptions,
  StyleEngine,
} from './index';

export { createStyleElements, getStyleElement };

function setRootVariables(vars: Variables) {
  const root = document.documentElement;

  objectLoop(vars, (value, key) => {
    root.style.setProperty(formatVariable(key), String(value));
  });
}

export function createClientEngine(options: Partial<EngineOptions> = {}): StyleEngine {
  const engine: StyleEngine = {
    ...createStyleEngine({
      cacheManager: createCacheManager(),
      sheetManager: createSheetManager(createStyleElements()),
      ...options,
    }),
    setRootVariables,
  };

  // Attempt to hydrate styles immediately
  hydrateStyles(engine);

  return engine;
}
