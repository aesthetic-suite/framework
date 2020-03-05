import { ClientRenderer, Renderer, CSSVariables } from '@aesthetic/style';
import { Theme, ThemeRegistry } from '@aesthetic/system';
import GlobalSheet from './GlobalSheet';
import LocalSheet from './LocalSheet';
import { LocalSheetFactory, GlobalSheetFactory, ThemeName, SheetQuery } from './types';

// TODO
// config options
// rtl

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
   * Create a local style sheet for use within components.
   */
  createComponentStyles = <T = unknown>(factory: LocalSheetFactory<T>) =>
    new LocalSheet<T>(factory);

  /**
   * Create a global style sheet for a theme and its root styles.
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
    const [name, theme] = this.themeRegistry.getPreferredTheme();

    this.changeTheme(name);

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

  renderComponentStyles = <T = unknown>(sheet: LocalSheet<T>, query: SheetQuery) => {
    if (__DEV__) {
      if (!(sheet instanceof LocalSheet)) {
        throw new TypeError('Rendering component styles require a `LocalSheet` instance.');
      }
    }

    return sheet.render(this.renderer, this.getActiveTheme(), query);
  };

  /**
   * Reset the current instance state for testing purposes.
   */
  resetForTesting() {
    this.activeTheme = '';
    this.renderer = createRenderer();
    this.themeRegistry.reset();
  }
}
