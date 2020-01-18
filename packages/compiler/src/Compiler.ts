import fs from 'fs';
import optimal, { string } from 'optimal';
import ejs, { AsyncTemplateFunction } from 'ejs';
import { camelCase } from 'lodash';
import { Path } from '@boost/common';
import { LAYERS } from '@aesthetic/system/src';
import ConfigLoader from './ConfigLoader';
import System from './System';
import SystemTheme from './SystemTheme';
import { TargetType, SystemOptions, PlatformType, ConfigFile } from './types';
import {
  BORDER_SIZES,
  BREAKPOINT_SIZES,
  HEADING_SIZES,
  SHADOW_SIZES,
  SPACING_SIZES,
  TEXT_SIZES,
} from './constants';

const TEMPLATES_FOLDER = Path.resolve('./templates', __dirname);

export default class Compiler {
  readonly configPath: Path;

  readonly options: Required<SystemOptions>;

  readonly targetPath: Path;

  constructor(configPath: string, targetPath: string, options: SystemOptions) {
    this.configPath = this.createAndValidatePath(
      configPath,
      'A configuration file path is required.',
    );

    this.targetPath = this.createAndValidatePath(
      targetPath,
      'A target destination file path is required.',
    );

    this.options = optimal(options, {
      platform: string().oneOf<PlatformType>(['android', 'ios', 'web']),
      target: string().oneOf<TargetType>([
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
  }

  async compile(): Promise<void> {
    // Load and validate the config
    const loader = new ConfigLoader(this.options.platform);
    const { themes: themesConfig, ...designConfig } = await loader.load(this.configPath);

    // Create the design system and theme variants
    const system = new System(designConfig, this.options);
    const themes = this.loadThemes(system, themesConfig);

    // Write the system file
    await this.writeSystemFile(system);
  }

  getTargetExtension(): string {
    switch (this.options.target) {
      case 'android':
        return 'java';
      case 'ios':
        return 'swift';
      case 'web-css':
        return 'css';
      case 'web-less':
        return 'less';
      case 'web-sass':
        return 'sass';
      case 'web-scss':
        return 'scss';
      case 'web-js':
        return 'js';
      case 'web-ts':
        return 'ts';
      default:
        return '';
    }
  }

  getTargetFilePath(fileName: string): string {
    return this.targetPath.append(`${fileName}.${this.getTargetExtension()}`).path();
  }

  async loadTemplateFile(name: string): Promise<AsyncTemplateFunction> {
    const templatePath = TEMPLATES_FOLDER.append(this.options.target, `${name}.ejs`);

    return ejs.compile(await fs.promises.readFile(templatePath.path(), 'utf8'), { async: true });
  }

  async writeSystemFile(system: System) {
    const template = await this.loadTemplateFile('system');

    return fs.promises.writeFile(
      this.getTargetFilePath('system'),
      await template({
        borderSizes: BORDER_SIZES,
        breakpointSizes: BREAKPOINT_SIZES,
        headingSizes: HEADING_SIZES,
        layerLevels: LAYERS,
        shadowSizes: SHADOW_SIZES,
        spacingSizes: SPACING_SIZES,
        textSizes: TEXT_SIZES,
        template: system.template,
      }),
      'utf8',
    );
  }

  // async writeMixinsFile() {}

  async writeThemeFile(name: string, theme: SystemTheme) {
    const template = await this.loadTemplateFile('theme');

    return fs.promises.writeFile(
      this.getTargetFilePath(`theme/${camelCase(name)}`),
      await template({
        template: theme.template,
      }),
      'utf8',
    );
  }

  protected createAndValidatePath(filePath: string, message: string): Path {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error(message);
    }

    const path = Path.resolve(filePath);

    if (!path.exists()) {
      throw new Error(`File path "${path.name()}" does not exist.`);
    }

    return path;
  }

  protected loadThemes(
    system: System,
    themesConfig: ConfigFile['themes'],
  ): Map<string, SystemTheme> {
    const themes = { ...themesConfig };
    const map = new Map<string, SystemTheme>();

    // Load all themes that do not extend another theme
    Object.entries(themes).forEach(([name, config]) => {
      if (!config.extends) {
        map.set(name, system.createTheme(config));

        delete themes[name];
      }
    });

    // Load themes that do extend another theme
    Object.entries(themes).forEach(([name, config]) => {
      const { extends: extendsFrom, ...themeConfig } = config;
      const parentTheme = map.get(extendsFrom!);

      if (!parentTheme) {
        throw new Error(`Trying to extend theme "${extendsFrom}" which does not exist.`);
      }

      map.set(name, parentTheme.extend(themeConfig, extendsFrom));
    });

    return map;
  }
}
