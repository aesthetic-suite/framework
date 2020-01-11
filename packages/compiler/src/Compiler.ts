import optimal, { string } from 'optimal';
import DesignSystem from './DesignSystem';
import Theme from './Theme';
import { ConfigFile, TargetType } from './types';

export interface CompilerOptions {
  target?: TargetType;
}

export default class Compiler {
  readonly config: ConfigFile;

  design!: DesignSystem;

  readonly options: Required<CompilerOptions>;

  themes: Map<string, Theme<string>> = new Map();

  constructor(config: ConfigFile, options: CompilerOptions = {}) {
    this.config = config;
    this.options = optimal(options, {
      target: string('web-css').oneOf<TargetType>([
        'android',
        'ios',
        'web-css',
        'web-less',
        'web-sass',
        'web-scss',
        'web-js',
        'web-ts',
      ]),
    });

    this.loadDesignAndThemes();
  }

  protected loadDesignAndThemes() {
    const { themes, ...designConfig } = this.config;

    this.design = new DesignSystem(designConfig);

    // Load all themes that do not extend another theme
    Object.entries(themes).forEach(([name, config]) => {
      if (!config.extends) {
        this.themes.set(name, this.design.createTheme(config));
        delete themes[name];
      }
    });

    // Load themes that do extend another theme
    Object.entries(themes).forEach(([name, config]) => {
      const { extends: extendsFrom, ...themeConfig } = config;
      const parentTheme = this.themes.get(extendsFrom!);

      if (!parentTheme) {
        throw new Error(`Trying to extend theme "${extendsFrom}" which does not exist.`);
      }

      this.themes.set(name, parentTheme.extend(themeConfig));
    });
  }
}
