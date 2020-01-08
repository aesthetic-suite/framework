import { DesignConfig, ThemeConfig } from '@aesthetic/framework';

export interface ConfigFile extends DesignConfig<string> {
  themes: { [name: string]: ThemeConfig<string> };
}
