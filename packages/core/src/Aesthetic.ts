import { Theme, ThemeRegistry } from '@aesthetic/system';
import LocalSheet from './LocalSheet';
import { LocalSheetFactory } from './types';

export default class Aesthetic {
  themeRegistry = new ThemeRegistry();

  /**
   * Create a local style sheet for use within components.
   */
  createLocalStyles = <T = unknown>(factory: LocalSheetFactory<T>) => new LocalSheet<T>(factory);

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
