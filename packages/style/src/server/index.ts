import { Variables } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';
import { TransientSheet, sortConditionalRules } from './sheet';
import {
  createCacheManager,
  createStyleEngine,
  createSheetManager,
  formatVariable,
  EngineOptions,
  StyleEngine,
} from '../index';

function setRootVariables(vars: Variables, engine: StyleEngine) {
  const sheet = engine.sheetManager.sheets.global;

  objectLoop(vars, (value, key) => {
    sheet.cssVariables[formatVariable(key)] = String(value);
  });
}

export function createServerEngine(options: Partial<EngineOptions>): StyleEngine {
  const sheetManager = createSheetManager({
    conditions: new TransientSheet(),
    global: new TransientSheet(),
    standard: new TransientSheet(),
  });

  const engine: StyleEngine = {
    ...createStyleEngine({
      cacheManager: createCacheManager(),
      sheetManager: {
        ...sheetManager,
        insertRule(type, rule, index) {
          const rank = sheetManager.insertRule(type, rule, index);

          if (type === 'conditions') {
            sortConditionalRules(sheetManager.sheets.conditions);
          }

          return rank;
        },
      },
      ...options,
    }),
    setRootVariables: (vars) => setRootVariables(vars, engine),
  };

  return engine;
}

export function extractStyles<T>(result: T, engine: StyleEngine): T {
  // global.AESTHETIC_CUSTOM_RENDERER = engine;
  process.env.AESTHETIC_SSR = 'true';

  return result;
}
