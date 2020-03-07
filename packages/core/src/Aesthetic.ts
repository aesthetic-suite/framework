import { ClientRenderer, Renderer, CSSVariables, FontFace, Keyframes } from '@aesthetic/style';
import { Theme, ThemeName, ThemeRegistry } from '@aesthetic/system';
import GlobalSheet from './GlobalSheet';
import LocalSheet from './LocalSheet';
import { LocalSheetFactory, GlobalSheetFactory, SheetQuery, AestheticOptions } from './types';

// TODO
// rtl
// theme specific `style` elements

function createRenderer(): Renderer {
  return global.AESTHETIC_SSR || new ClientRenderer();
}

export default class Aesthetic {
  activeTheme: ThemeName = '';

  globalSheetRegistry = new Map<ThemeName, GlobalSheet>();

  renderer = createRenderer();

  themeRegistry = new ThemeRegistry();

  /**
   * Change the currently active theme.
   */
  changeTheme = (name: ThemeName) => {
    const theme = this.getTheme(name);

    // Set as the active theme
    this.activeTheme = name;

    // Apply CSS variables to `:root`
    this.renderer.applyRootVariables((theme.toVariables() as unknown) as CSSVariables);

    // Render theme styles and append a `body` class name
    const globalSheet = this.globalSheetRegistry.get(name);

    if (globalSheet) {
      document.body.className = globalSheet.render(this.renderer, theme);
    }
  };

  /**
   * Configure Aesthetic and its styling engine.
   */
  configure = (options: AestheticOptions) => {
    if (options.defaultUnit !== undefined) {
      this.renderer.options.defaultUnit = options.defaultUnit;
    }

    if (options.deterministicClasses !== undefined) {
      this.renderer.options.deterministicClasses = options.deterministicClasses;
    }

    if (options.vendorPrefixes !== undefined) {
      this.renderer.options.vendorPrefixes = options.vendorPrefixes;
    }
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
   * Return the currently active theme instance. If an active instance has not been defined,
   * one will be detected from the client's browser preferences.
   */
  getActiveTheme = () => {
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
   * Render a component style sheet to the document with the defined style query parameters.
   */
  renderComponentStyles = <T = unknown>(sheet: LocalSheet<T>, query: SheetQuery) => {
    if (__DEV__) {
      if (!(sheet instanceof LocalSheet)) {
        throw new TypeError('Rendering component styles require a `LocalSheet` instance.');
      }
    }

    return sheet.render(this.renderer, this.getActiveTheme(), query);
  };

  /**
   * Render a `@font-face` to the global style sheet and return the font family name.
   */
  renderFontFace = (fontFace: FontFace) => this.renderer.renderFontFace(fontFace);

  /**
   * Render an `@import` to the global style sheet.
   */
  renderImport = (path: string) => this.renderer.renderImport(path);

  /**
   * Render a `@keyframes` to the global style sheet and return the animation name.
   */
  renderKeyframes = (animationName: string, keyframes: Keyframes) =>
    this.renderer.renderKeyframes(keyframes, animationName);

  /**
   * Reset the current instance state for testing purposes.
   */
  resetForTesting() {
    this.activeTheme = '';
    this.renderer = createRenderer();
    this.globalSheetRegistry.clear();
    this.themeRegistry.reset();
  }
}
