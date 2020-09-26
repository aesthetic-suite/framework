/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { ClientRenderer } from '@aesthetic/style';
import { activeDirection, changeDirection, getActiveDirection } from './direction';
import { listeners, subscribe, unsubscribe } from './events';
import { configure, options } from './options';
import {
  getRenderer,
  hydrate,
  renderFontFace,
  renderImport,
  renderKeyframes,
  styleRenderer,
} from './render';
import { createComponentStyles, generateClassName, renderComponentStyles } from './styles';
import {
  activeTheme,
  changeTheme,
  createThemeStyles,
  getActiveTheme,
  getTheme,
  globalSheetRegistry,
  registerDefaultTheme,
  registerTheme,
  renderThemeStyles,
  themeRegistry,
} from './themes';
import StyleSheet from './StyleSheet';

export * from '@aesthetic/sss';
export * from '@aesthetic/system';
export * from './types';

export {
  changeDirection,
  changeTheme,
  configure,
  createComponentStyles,
  createThemeStyles,
  generateClassName,
  getActiveDirection,
  getActiveTheme,
  getRenderer,
  getTheme,
  hydrate,
  registerDefaultTheme,
  registerTheme,
  renderComponentStyles,
  renderFontFace,
  renderImport,
  renderKeyframes,
  renderThemeStyles,
  subscribe,
  unsubscribe,
  ClientRenderer,
  StyleSheet,
};

export function resetForTesting() {
  if (process.env.NODE_ENV === 'test') {
    activeDirection.reset();
    activeTheme.reset();
    styleRenderer.reset();
    listeners.clear();
    globalSheetRegistry.clear();
    themeRegistry.reset();

    configure({
      customProperties: {},
      defaultUnit: 'px',
      deterministicClasses: false,
      directionConverter: null,
      vendorPrefixer: null,
    });
  }
}

export function getInternalsForTesting(): {
  activeDirection: string | undefined;
  activeTheme: string | undefined;
  globalSheetRegistry: typeof globalSheetRegistry;
  listeners: typeof listeners;
  options: typeof options;
  themeRegistry: typeof themeRegistry;
} {
  if (process.env.NODE_ENV === 'test') {
    return {
      activeDirection: activeDirection.get(),
      activeTheme: activeTheme.get(),
      globalSheetRegistry,
      listeners,
      options,
      themeRegistry,
    };
  }

  // We purposefully silence since this is only for testing,
  // and we want a smaller bundle in production!
  // @ts-expect-error
  return {};
}
