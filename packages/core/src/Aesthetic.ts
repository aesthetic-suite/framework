/* eslint-disable no-param-reassign, lines-between-class-members, no-dupe-class-members */

import { arrayLoop, createState, isSSR } from '@aesthetic/utils';
import {
  ClassName,
  Direction,
  Engine,
  FontFace,
  Keyframes,
  RenderOptions,
  ThemeName,
  Variables,
} from '@aesthetic/types';
import { FontFace as SSSFontFace, formatFontFace, LocalBlock } from '@aesthetic/sss';
import { Theme, ThemeRegistry } from '@aesthetic/system';
import StyleSheet from './StyleSheet';
import {
  AestheticOptions,
  ClassNameSheet,
  EventListener,
  EventType,
  LocalSheet,
  LocalSheetFactory,
  GlobalSheet,
  GlobalSheetFactory,
  OnChangeDirection,
  OnChangeTheme,
  SheetParams,
} from './types';

export default class Aesthetic {
  protected activeDirection = createState<Direction>();

  protected activeTheme = createState<ThemeName>();

  protected globalSheetRegistry = new Map<ThemeName, GlobalSheet>();

  protected listeners = new Map<EventType, Set<EventListener>>();

  protected options: AestheticOptions = {};

  protected styleEngine = createState<Engine<ClassName>>();

  protected themeRegistry = new ThemeRegistry();

  constructor(options?: AestheticOptions) {
    if (options) {
      this.configure(options);
    }
  }

  /**
   * Change the active direction.
   */
  changeDirection(direction: Direction, propagate: boolean = true) {
    if (direction === this.activeDirection.get()) {
      return;
    }

    // Set the active direction
    this.activeDirection.set(direction);

    // Update document attribute
    if (!isSSR()) {
      document.documentElement.setAttribute('dir', direction);
    }

    // Let consumers know about the change
    if (propagate) {
      this.emit('change:direction', [direction]);
    }
  }

  /**
   * Change the active theme.
   */
  changeTheme(name: ThemeName, propagate: boolean = true) {
    if (name === this.activeTheme.get()) {
      return;
    }

    const theme = this.getTheme(name);

    // Set the active theme
    this.activeTheme.set(name);

    // Apply theme variables to `:root`
    this.getEngine().setRootVariables((theme.toVariables() as unknown) as Variables);

    // Render theme styles and append a `body` class name
    const themeClassName = this.renderThemeStyles(theme);

    if (!isSSR()) {
      document.body.className = themeClassName;
    }

    // Let consumers know about the change
    if (propagate) {
      this.emit('change:theme', [name]);
    }
  }

  /**
   * Configure options unique to this instance.
   */
  configure(customOptions: AestheticOptions) {
    Object.assign(this.options, customOptions);

    // Configure the engine with itself to reapply options
    const engine = this.styleEngine.get();

    if (engine) {
      this.configureEngine(engine);
    }
  }

  /**
   * Configuring which styling engine to use.
   */
  configureEngine(engine: Engine<ClassName>) {
    const { options } = this;

    engine.direction = this.getActiveDirection();

    if (!engine.directionConverter && options.directionConverter) {
      engine.directionConverter = options.directionConverter;
    }

    if (!engine.unitSuffixer && options.defaultUnit) {
      engine.unitSuffixer = options.defaultUnit;
    }

    if (!engine.vendorPrefixer && options.vendorPrefixer) {
      engine.vendorPrefixer = options.vendorPrefixer;
    }

    this.styleEngine.set(engine);
  }

  /**
   * Create a local style sheet for use within components.
   */
  createComponentStyles<T = unknown>(
    factory: LocalSheetFactory<T, LocalBlock>,
  ): LocalSheet<T, LocalBlock> {
    const sheet: LocalSheet<T, LocalBlock> = new StyleSheet('local', factory);

    // Attempt to render styles immediately so they're available on mount
    this.renderComponentStyles(sheet);

    return sheet;
  }

  /**
   * Create a global style sheet for root theme styles.
   */
  createThemeStyles<T = unknown>(
    factory: GlobalSheetFactory<T, LocalBlock>,
  ): GlobalSheet<T, LocalBlock> {
    return new StyleSheet('global', factory);
  }

  /**
   * Emit all listeners by type, with the defined arguments.
   */
  emit(type: 'change:direction', args: Parameters<OnChangeDirection>): void;
  emit(type: 'change:theme', args: Parameters<OnChangeTheme>): void;
  emit(type: EventType, args: unknown[]): void {
    this.getListeners(type).forEach((listener) => {
      listener(...args);
    });
  }

  /**
   * Generate a class name using the selectors of a style sheet.
   * If an object is provided, it will be used to check for variants.
   */
  generateClassName<T extends string>(
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
  getActiveDirection(): Direction {
    const active = this.activeDirection.get();

    if (active) {
      return active;
    }

    let direction: Direction = 'ltr';

    if (!isSSR()) {
      direction = (document.documentElement.getAttribute('dir') ||
        document.body.getAttribute('dir') ||
        'ltr') as Direction;
    }

    this.changeDirection(direction);

    return direction;
  }

  /**
   * Return the currently active theme instance. If an active instance has not been defined,
   * one will be detected from the client's browser preferences.
   */
  getActiveTheme(): Theme {
    const active = this.activeTheme.get();

    if (active) {
      return this.getTheme(active);
    }

    // Detect theme from browser preferences
    const theme = this.themeRegistry.getPreferredTheme();

    this.changeTheme(theme.name);

    return theme;
  }

  /**
   * Return the current style engine.
   */
  getEngine(): Engine<ClassName> {
    const current = global.AESTHETIC_CUSTOM_ENGINE || this.styleEngine.get();

    if (current) {
      return current;
    }

    throw new Error('No style engine defined. Have you configured one with `configureEngine()`?');
  }

  /**
   * Return a set of listeners, or create it if it does not exist.
   */
  getListeners<T extends Function>(type: EventType): Set<T> {
    const set = this.listeners.get(type) || new Set();

    this.listeners.set(type, set);

    return (set as unknown) as Set<T>;
  }

  /**
   * Return a theme instance by name.
   */
  getTheme(name: ThemeName) {
    return this.themeRegistry.getTheme(name);
  }

  /**
   * Register a theme, with optional global theme styles.
   */
  registerTheme(
    name: ThemeName,
    theme: Theme,
    sheet: GlobalSheet | null = null,
    isDefault: boolean = false,
  ) {
    this.themeRegistry.register(name, theme, isDefault);

    if (sheet) {
      if (__DEV__) {
        if (!(sheet instanceof StyleSheet) || sheet.type !== 'global') {
          throw new TypeError('Rendering theme styles require a `GlobalSheet` instance.');
        }
      }

      this.globalSheetRegistry.set(name, sheet);
    }
  }

  /**
   * Register a default light or dark theme, with optional global theme styles.
   */
  registerDefaultTheme(name: ThemeName, theme: Theme, sheet: GlobalSheet | null = null) {
    this.registerTheme(name, theme, sheet, true);
  }

  /**
   * Render a component style sheet to the document with the defined style query parameters.
   */
  renderComponentStyles<T = unknown>(sheet: LocalSheet<T, LocalBlock>, params: SheetParams = {}) {
    if (__DEV__) {
      if (!(sheet instanceof StyleSheet) || sheet.type !== 'local') {
        throw new TypeError('Rendering component styles require a `LocalSheet` instance.');
      }
    }

    const theme = params.theme ? this.getTheme(params.theme) : this.getActiveTheme();

    return sheet.render(this.getEngine(), theme, {
      customProperties: this.options.customProperties,
      direction: this.getActiveDirection(),
      vendor: !!this.options.vendorPrefixer,
      ...params,
    });
  }

  /**
   * Render a `@font-face` to the global style sheet and return the font family name.
   */
  renderFontFace(fontFace: FontFace | SSSFontFace, fontFamily?: string, params?: RenderOptions) {
    return this.getEngine().renderFontFace(
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
  renderImport(path: string, params?: RenderOptions) {
    return this.getEngine().renderImport(path, params);
  }

  /**
   * Render a `@keyframes` to the global style sheet and return the animation name.
   */
  renderKeyframes(keyframes: Keyframes, animationName?: string, params?: RenderOptions) {
    return this.getEngine().renderKeyframes(keyframes, animationName, params);
  }

  /**
   * Render a global theme style sheet and return a class name, if one was generated.
   */
  renderThemeStyles(theme: Theme, params: SheetParams = {}): ClassName {
    const sheet = this.globalSheetRegistry.get(theme.name);

    if (!sheet) {
      return '';
    }

    const result = sheet.render(this.getEngine(), theme, {
      customProperties: this.options.customProperties,
      direction: this.getActiveDirection(),
      vendor: !!this.options.vendorPrefixer,
      ...params,
    });

    return result['@root']?.class || '';
  }

  /**
   * Subscribe and listen to an event by name.
   */
  subscribe(type: 'change:direction', listener: OnChangeDirection): () => void;
  subscribe(type: 'change:theme', listener: OnChangeTheme): () => void;
  subscribe(type: EventType, listener: Function): () => void {
    this.getListeners(type).add(listener);

    return () => {
      this.unsubscribe(type as 'change:theme', listener as OnChangeTheme);
    };
  }

  /**
   * Unsubscribe from an event by name.
   */
  unsubscribe(type: 'change:direction', listener: OnChangeDirection): void;
  unsubscribe(type: 'change:theme', listener: OnChangeTheme): void;
  unsubscribe(type: EventType, listener: Function) {
    this.getListeners(type).delete(listener);
  }
}
