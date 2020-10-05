import { LocalBlock } from '@aesthetic/sss';
import { Theme, ThemeRegistry } from '@aesthetic/system';
import { ClassName, ThemeName, Variables } from '@aesthetic/types';
import { createState, isSSR } from '@aesthetic/utils';
import { getActiveDirection } from './direction';
import { emit } from './events';
import { getEngine } from './render';
import { options } from './options';
import StyleSheet from './StyleSheet';
import { GlobalSheet, GlobalSheetFactory, SheetParams } from './types';

export const globalSheetRegistry = new Map<ThemeName, GlobalSheet>();

export const themeRegistry = new ThemeRegistry();

export const activeTheme = createState<ThemeName>();

/**
 * Create a global style sheet for root theme styles.
 */
export function createThemeStyles<T = unknown>(
  factory: GlobalSheetFactory<T, LocalBlock>,
): GlobalSheet<T, LocalBlock> {
  return new StyleSheet('global', factory);
}

/**
 * Return a theme instance by name.
 */
export function getTheme(name: ThemeName) {
  return themeRegistry.getTheme(name);
}

/**
 * Return the currently active theme instance. If an active instance has not been defined,
 * one will be detected from the client's browser preferences.
 */
export function getActiveTheme(): Theme {
  const active = activeTheme.get();

  if (active) {
    return getTheme(active);
  }

  // Detect theme from browser preferences
  const theme = themeRegistry.getPreferredTheme();

  changeTheme(theme.name);

  return theme;
}

/**
 * Register a theme, with optional global theme styles.
 */
export function registerTheme(
  name: ThemeName,
  theme: Theme,
  sheet: GlobalSheet | null = null,
  isDefault: boolean = false,
) {
  themeRegistry.register(name, theme, isDefault);

  if (sheet) {
    if (__DEV__) {
      if (!(sheet instanceof StyleSheet) || sheet.type !== 'global') {
        throw new TypeError('Rendering theme styles require a `GlobalSheet` instance.');
      }
    }

    globalSheetRegistry.set(name, sheet);
  }
}

/**
 * Register a default light or dark theme, with optional global theme styles.
 */
export function registerDefaultTheme(
  name: ThemeName,
  theme: Theme,
  sheet: GlobalSheet | null = null,
) {
  registerTheme(name, theme, sheet, true);
}

/**
 * Change the active theme.
 */
export function changeTheme(name: ThemeName, propagate: boolean = true) {
  if (name === activeTheme.get()) {
    return;
  }

  const theme = getTheme(name);

  // Set the active theme
  activeTheme.set(name);

  // Apply theme variables to `:root`
  getEngine().setRootVariables((theme.toVariables() as unknown) as Variables);

  // Render theme styles and append a `body` class name
  const themeClassName = renderThemeStyles(theme);

  if (!isSSR()) {
    document.body.className = themeClassName;
  }

  // Let consumers know about the change
  if (propagate) {
    emit('change:theme', [name]);
  }
}

/**
 * Render a global theme style sheet and return a class name, if one was generated.
 */
export function renderThemeStyles(theme: Theme, params: SheetParams = {}): ClassName {
  const sheet = globalSheetRegistry.get(theme.name);

  if (!sheet) {
    return '';
  }

  return sheet.render(getEngine(), theme, {
    direction: getActiveDirection(),
    vendor: !!options.vendorPrefixer,
    ...params,
  });
}
