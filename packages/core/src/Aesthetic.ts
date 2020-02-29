import { Theme, ThemeRegistry } from '@aesthetic/system';

export default class Aesthetic {
  themeRegistry = new ThemeRegistry();

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
