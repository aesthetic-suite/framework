/* eslint-disable @typescript-eslint/no-use-before-define, no-use-before-define */

import { ClientRenderer, ProcessOptions, Renderer } from '@aesthetic/style';
import {
  FontFace as SSSFontFace,
  Import as SSSImport,
  formatFontFace,
  formatImport,
} from '@aesthetic/sss';
import { Theme, ThemeRegistry } from '@aesthetic/system';
import { arrayLoop, isSSR } from '@aesthetic/utils';
import { ClassName, ThemeName, FontFace, Keyframes, Variables, Direction } from '@aesthetic/types';
import StyleSheet from './StyleSheet';
import {
  AestheticOptions,
  ClassNameSheet,
  EventType,
  GlobalSheet,
  GlobalSheetFactory,
  LocalSheet,
  LocalSheetFactory,
  OnChangeDirection,
  OnChangeTheme,
  SheetParams,
} from './types';

const globalSheetRegistry = new Map<ThemeName, GlobalSheet>();

const defaultOptions: Required<AestheticOptions> = {
  defaultUnit: 'px',
  deterministicClasses: false,
  vendorPrefixer: null,
};

const themeRegistry = new ThemeRegistry();

let activeDirection: Direction | undefined;

let activeTheme: ThemeName | undefined;

let listeners: { [K in EventType]?: Set<(...args: unknown[]) => void> } = {};

let options: Required<AestheticOptions> = { ...defaultOptions };

let styleRenderer: Renderer | undefined;

/**
 * Return a set of listeners, or create it if it does not exist.
 */
function getListeners<T extends Function>(type: EventType): Set<T> {
  if (!listeners[type]) {
    listeners[type] = new Set();
  }

  return (listeners[type] as unknown) as Set<T>;
}

/**
 * Subscribe and listen to an event by name.
 */
export function subscribe(type: 'change:direction', listener: OnChangeDirection): void;
export function subscribe(type: 'change:theme', listener: OnChangeTheme): void;
export function subscribe(type: EventType, listener: Function) {
  getListeners(type).add(listener);
}

/**
 * Unsubscribe from an event by name.
 */
export function unsubscribe(type: 'change:direction', listener: OnChangeDirection): void;
export function unsubscribe(type: 'change:theme', listener: OnChangeTheme): void;
export function unsubscribe(type: EventType, listener: Function) {
  getListeners(type).delete(listener);
}

/**
 * Emit all listeners by type, with the defined arguments.
 */
function emit(type: 'change:direction', args: Parameters<OnChangeDirection>): void;
function emit(type: 'change:theme', args: Parameters<OnChangeTheme>): void;
function emit(type: EventType, args: unknown[]): void {
  getListeners(type).forEach((listener) => {
    listener(...args);
  });
}

/**
 * Configure Aesthetic and its styling engine.
 */
export function configure(customOptions: AestheticOptions) {
  Object.assign(options, customOptions);
}

/**
 * Create a local style sheet for use within components.
 */
export function createComponentStyles<T = unknown>(factory: LocalSheetFactory<T>): LocalSheet<T> {
  return new StyleSheet('local', factory);
}

/**
 * Create a global style sheet for root theme styles.
 */
export function createThemeStyles<T = unknown>(factory: GlobalSheetFactory<T>): GlobalSheet<T> {
  return new StyleSheet('global', factory);
}

/**
 * Generate a class name using the selectors of a style sheet.
 * If an object is provided, it will be used to check for variants.
 */
export function generateClassName<T extends string>(
  keys: T[],
  variants: string[],
  classNames: ClassNameSheet<string>,
): ClassName {
  const className: string[] = [];

  arrayLoop(keys, (key) => {
    const hash = classNames[key];

    if (!hash) {
      return;
    }

    if (hash.class) {
      className.push(hash.class);
    }

    if (hash.variants) {
      arrayLoop(variants, (variant) => {
        if (hash.variants?.[variant]) {
          className.push(hash.variants[variant]);
        }
      });
    }
  });

  return className.join(' ');
}

/**
 * Return the active direction for the entire document. If an active direction is undefined,
 * it will be detected from the browser's `dir` attribute.
 */
export function getActiveDirection(): Direction {
  if (activeDirection) {
    return activeDirection;
  }

  let direction: Direction = 'ltr';

  if (!isSSR()) {
    direction = (document.documentElement?.getAttribute('dir') ||
      document.body?.getAttribute('dir') ||
      'ltr') as Direction;
  }

  changeDirection(direction);

  return direction;
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
  if (activeTheme) {
    return getTheme(activeTheme);
  }

  // Detect theme from browser preferences
  const theme = themeRegistry.getPreferredTheme();

  changeTheme(theme.name);

  return theme;
}

/**
 * Return a style renderer. When SSR, use a server based renderer.
 */
export function getRenderer() {
  if (global.AESTHETIC_CUSTOM_RENDERER) {
    return global.AESTHETIC_CUSTOM_RENDERER;
  }

  if (!styleRenderer) {
    styleRenderer = new ClientRenderer();
  }

  return styleRenderer;
}

/**
 * Hydrate styles from the document if they have been pre-compiled during a server-side render.
 */
export function hydrate() {
  const renderer = getRenderer();

  if (renderer instanceof ClientRenderer) {
    renderer.hydrateStyles();
  }
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
 * Render a component style sheet to the document with the defined style query parameters.
 */
export function renderComponentStyles<T = unknown>(sheet: LocalSheet<T>, params: SheetParams = {}) {
  if (__DEV__) {
    if (!(sheet instanceof StyleSheet) || sheet.type !== 'local') {
      throw new TypeError('Rendering component styles require a `LocalSheet` instance.');
    }
  }

  const theme = params.theme ? getTheme(params.theme) : getActiveTheme();

  return sheet.render(getRenderer(), theme, {
    direction: getActiveDirection(),
    unit: options.defaultUnit,
    vendor: options.vendorPrefixer,
    ...params,
  });
}

/**
 * Render a `@font-face` to the global style sheet and return the font family name.
 */
export function renderFontFace(
  fontFace: FontFace | SSSFontFace,
  fontFamily?: string,
  params?: ProcessOptions,
) {
  return getRenderer().renderFontFace(
    formatFontFace({
      fontFamily,
      ...fontFace,
    }) as FontFace,
    params,
  );
}

/**
 * Render an `@import` to the global style sheet.
 */
export function renderImport(path: string | SSSImport) {
  return getRenderer().renderImport(formatImport(path));
}

/**
 * Render a `@keyframes` to the global style sheet and return the animation name.
 */
export function renderKeyframes(
  keyframes: Keyframes,
  animationName?: string,
  params?: ProcessOptions,
) {
  return getRenderer().renderKeyframes(keyframes, animationName, params);
}

/**
 * Render a global theme style sheet and return a class name, if one was generated.
 */
export function renderThemeStyles(theme: Theme, params: SheetParams = {}): ClassName {
  const sheet = globalSheetRegistry.get(theme.name);

  if (!sheet) {
    return '';
  }

  return sheet.render(getRenderer(), theme, {
    direction: getActiveDirection(),
    unit: options.defaultUnit,
    vendor: options.vendorPrefixer,
    ...params,
  });
}

/**
 * Change the active direction.
 */
export function changeDirection(direction: Direction, propagate: boolean = true) {
  if (direction === activeDirection) {
    return;
  }

  // Set the active direction
  activeDirection = direction;

  // Update document attribute
  if (!isSSR()) {
    document.documentElement.setAttribute('dir', direction);
  }

  // Let consumers know about the change
  if (propagate) {
    emit('change:direction', [direction]);
  }
}

/**
 * Change the active theme.
 */
export function changeTheme(name: ThemeName, propagate: boolean = true) {
  if (name === activeTheme) {
    return;
  }

  const theme = getTheme(name);

  // Set the active theme
  activeTheme = name;

  // Apply theme variables to `:root`
  getRenderer().applyRootVariables((theme.toVariables() as unknown) as Variables);

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
 * Reset the current instance state for testing purposes.
 */
export function resetForTesting() {
  if (process.env.NODE_ENV === 'test') {
    activeDirection = undefined;
    activeTheme = undefined;
    styleRenderer = undefined;
    listeners = {};
    options = { ...defaultOptions };
    globalSheetRegistry.clear();
    themeRegistry.reset();
  }
}

export function getInternalsForTesting() {
  return {
    activeDirection,
    activeTheme,
    globalSheetRegistry,
    listeners,
    options,
    themeRegistry,
  };
}
