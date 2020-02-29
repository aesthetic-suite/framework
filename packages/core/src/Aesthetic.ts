import { Theme, ThemeRegistry } from '@aesthetic/system';
import GlobalSheet from './GlobalSheet';
import LocalSheet from './LocalSheet';
import { LocalSheetFactory, GlobalSheetFactory } from './types';

// TODO
// change theme
// config options
// sheet cache
// style injection
// rtl

export default class Aesthetic {
  themeRegistry = new ThemeRegistry();

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
   * Return a theme instance by name.
   */
  getTheme = (name: string) => this.themeRegistry.getTheme(name);

  /**
   * Register a theme into the registry.
   */
  registerTheme = (name: string, theme: Theme, isDefault: boolean = false) => {
    this.themeRegistry.register(name, theme, isDefault);
  };
}
