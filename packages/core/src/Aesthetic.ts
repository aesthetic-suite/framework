/* eslint-disable no-dupe-class-members */

import { ClientRenderer, ProcessOptions, Renderer } from '@aesthetic/style';
import {
  FontFace as SSSFontFace,
  Import as SSSImport,
  formatFontFace,
  formatImport,
} from '@aesthetic/sss';
import { Theme, ThemeRegistry } from '@aesthetic/system';
import { arrayLoop, isObject, objectLoop, isSSR } from '@aesthetic/utils';
import { ClassName, ThemeName, FontFace, Keyframes, Variables, Direction } from '@aesthetic/types';
import GlobalSheet from './GlobalSheet';
import LocalSheet from './LocalSheet';
import {
  AestheticOptions,
  ClassNameSheet,
  ClassNameSheetVariants,
  EventType,
  GlobalSheetFactory,
  LocalSheetFactory,
  OnChangeDirection,
  OnChangeTheme,
  SheetParams,
} from './types';

export default class Aesthetic {
  activeDirection?: Direction;

  activeTheme?: ThemeName;

  globalSheetRegistry = new Map<ThemeName, GlobalSheet>();

  options: Required<AestheticOptions> = {
    defaultUnit: 'px',
    deterministicClasses: false,
    vendorPrefixes: false,
  };

  themeRegistry = new ThemeRegistry();

  protected listeners: { [K in EventType]?: Set<(...args: unknown[]) => void> } = {};

  protected styleRenderer?: Renderer;

  constructor() {
    // We must bind here so that we can method overload
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  /**
   * Change the active direction.
   */
  changeDirection = (direction: Direction, propagate: boolean = true) => {
    if (direction === this.activeDirection) {
      return;
    }

    // Set the active direction
    this.activeDirection = direction;

    // Update document attribute
    if (!isSSR()) {
      document.documentElement.setAttribute('dir', direction);
    }

    // Let consumers know about the change
    if (propagate) {
      this.emit('change:direction', [direction]);
    }
  };

  /**
   * Change the active theme.
   */
  changeTheme = (name: ThemeName, propagate: boolean = true) => {
    if (name === this.activeTheme) {
      return;
    }

    const theme = this.getTheme(name);

    // Set the active theme
    this.activeTheme = name;

    // Apply theme variables to `:root`
    this.renderer.applyRootVariables((theme.toVariables() as unknown) as Variables);

    // Render theme styles and append a `body` class name
    const themeClassName = this.renderThemeStyles(theme);

    if (!isSSR()) {
      document.body.className = themeClassName;
    }

    // Let consumers know about the change
    if (propagate) {
      this.emit('change:theme', [name]);
    }
  };

  /**
   * Configure Aesthetic and its styling engine.
   */
  configure = (options: AestheticOptions) => {
    Object.assign(this.options, options);
  };

  /**
   * Create a local style sheet for use within components.
   */
  createComponentStyles = <T = unknown>(factory: LocalSheetFactory<T>) =>
    new LocalSheet<T>(factory);

  /**
   * Create a global style sheet for root theme styles.
   */
  createThemeStyles = <T = unknown>(factory: GlobalSheetFactory<T>) => new GlobalSheet<T>(factory);

  /**
   * Generate a class name using the selectors of a style sheet.
   * If an object is provided, it will be used to check for variants.
   */
  generateClassName = <T extends string>(
    keys: (T | ClassNameSheetVariants)[],
    classNames: ClassNameSheet<string>,
  ): ClassName => {
    const className: string[] = [];
    const variants: ClassNameSheetVariants = {};
    const selectors: T[] = [];

    arrayLoop(keys, (key) => {
      if (isObject(key)) {
        Object.assign(variants, key);
      } else if (typeof key === 'string') {
        selectors.push(key);
      }
    });

    arrayLoop(selectors, (selector) => {
      const hash = classNames[selector];

      if (!hash) {
        return;
      }

      if (hash.class) {
        className.push(hash.class);
      }

      if (hash.variants) {
        objectLoop(variants, (value, type) => {
          const variant = `${type}_${value}`;

          if (hash.variants?.[variant]) {
            className.push(hash.variants[variant]);
          }
        });
      }
    });

    return className.join(' ');
  };

  /**
   * Return the active direction for the entire document. If an active direction is undefined,
   * it will be detected from the browser's `dir` attribute.
   */
  getActiveDirection = (): Direction => {
    if (this.activeDirection) {
      return this.activeDirection;
    }

    let direction: Direction = 'ltr';

    if (!isSSR()) {
      direction = (document.documentElement?.getAttribute('dir') ||
        document.body?.getAttribute('dir') ||
        'ltr') as Direction;
    }

    this.changeDirection(direction);

    return direction;
  };

  /**
   * Return the currently active theme instance. If an active instance has not been defined,
   * one will be detected from the client's browser preferences.
   */
  getActiveTheme = (): Theme => {
    if (this.activeTheme) {
      return this.getTheme(this.activeTheme);
    }

    // Detect theme from browser preferences
    const theme = this.themeRegistry.getPreferredTheme();

    this.changeTheme(theme.name);

    return theme;
  };

  /**
   * Return a theme instance by name.
   */
  getTheme = (name: ThemeName) => this.themeRegistry.getTheme(name);

  /**
   * Hydrate styles from the document if they have been pre-compiled during a server-side render.
   */
  hydrate = () => {
    if (this.renderer instanceof ClientRenderer) {
      this.renderer.hydrateStyles();
    }
  };

  /**
   * Register a default light or dark theme, with optional global theme styles.
   */
  registerDefaultTheme = (name: ThemeName, theme: Theme, sheet: GlobalSheet | null = null) => {
    this.registerTheme(name, theme, sheet, true);
  };

  /**
   * Register a theme, with optional global theme styles.
   */
  registerTheme = (
    name: ThemeName,
    theme: Theme,
    sheet: GlobalSheet | null = null,
    isDefault: boolean = false,
  ) => {
    this.themeRegistry.register(name, theme, isDefault);

    if (sheet) {
      if (__DEV__) {
        if (!(sheet instanceof GlobalSheet)) {
          throw new TypeError('Rendering theme styles require a `GlobalSheet` instance.');
        }
      }

      this.globalSheetRegistry.set(name, sheet);
    }
  };

  /**
   * Return a style renderer. When SSR, use a server based renderer.
   */
  get renderer() {
    if (global.AESTHETIC_CUSTOM_RENDERER) {
      return global.AESTHETIC_CUSTOM_RENDERER;
    }

    if (!this.styleRenderer) {
      this.styleRenderer = new ClientRenderer();
    }

    return this.styleRenderer;
  }

  /**
   * Render a component style sheet to the document with the defined style query parameters.
   */
  renderComponentStyles = <T = unknown>(sheet: LocalSheet<T>, params: SheetParams = {}) => {
    if (__DEV__) {
      if (!(sheet instanceof LocalSheet)) {
        throw new TypeError('Rendering component styles require a `LocalSheet` instance.');
      }
    }

    const theme = params.theme ? this.getTheme(params.theme) : this.getActiveTheme();

    return sheet.render(this.renderer, theme, {
      direction: this.getActiveDirection(),
      unit: this.options.defaultUnit,
      vendor: this.options.vendorPrefixes,
      ...params,
    });
  };

  /**
   * Render a `@font-face` to the global style sheet and return the font family name.
   */
  renderFontFace = (
    fontFace: FontFace | SSSFontFace,
    fontFamily?: string,
    params?: ProcessOptions,
  ) =>
    this.renderer.renderFontFace(
      formatFontFace({
        fontFamily,
        ...fontFace,
      }) as FontFace,
      params,
    );

  /**
   * Render an `@import` to the global style sheet.
   */
  renderImport = (path: string | SSSImport) => this.renderer.renderImport(formatImport(path));

  /**
   * Render a `@keyframes` to the global style sheet and return the animation name.
   */
  renderKeyframes = (keyframes: Keyframes, animationName?: string, params?: ProcessOptions) =>
    this.renderer.renderKeyframes(keyframes, animationName, params);

  /**
   * Render a global theme style sheet and return a class name, if one was generated.
   */
  renderThemeStyles = (theme: Theme, params: SheetParams = {}): ClassName => {
    const sheet = this.globalSheetRegistry.get(theme.name);

    if (!sheet) {
      return '';
    }

    return sheet.render(this.renderer, theme, {
      direction: this.getActiveDirection(),
      unit: this.options.defaultUnit,
      vendor: this.options.vendorPrefixes,
      ...params,
    });
  };

  /**
   * Reset the current instance state for testing purposes.
   */
  resetForTesting() {
    if (process.env.NODE_ENV === 'test') {
      this.activeDirection = 'ltr';
      this.activeTheme = '';
      this.styleRenderer = undefined;
      this.globalSheetRegistry.clear();
      this.themeRegistry.reset();
    }
  }

  /**
   * Subscribe and listen to an event by name.
   */
  subscribe(type: 'change:direction', listener: OnChangeDirection): void;

  subscribe(type: 'change:theme', listener: OnChangeTheme): void;

  subscribe(type: EventType, listener: Function) {
    this.getListeners(type).add(listener);
  }

  /**
   * Unsubscribe from an event by name.
   */
  unsubscribe(type: 'change:direction', listener: OnChangeDirection): void;

  unsubscribe(type: 'change:theme', listener: OnChangeTheme): void;

  unsubscribe(type: EventType, listener: Function) {
    this.getListeners(type).delete(listener);
  }

  /**
   * Emit all listeners by type, with the defined arguments.
   */
  protected emit(type: 'change:direction', args: Parameters<OnChangeDirection>): void;

  protected emit(type: 'change:theme', args: Parameters<OnChangeTheme>): void;

  protected emit(type: EventType, args: unknown[]): void {
    this.getListeners(type).forEach((listener) => {
      listener(...args);
    });
  }

  /**
   * Return a set of listeners, or create it if it does not exist.
   */
  protected getListeners<T extends Function>(type: EventType): Set<T> {
    if (!this.listeners[type]) {
      this.listeners[type] = new Set();
    }

    return (this.listeners[type] as unknown) as Set<T>;
  }
}
