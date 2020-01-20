import fs from 'fs';
import optimal, { string } from 'optimal';
import ejs, { AsyncTemplateFunction } from 'ejs';
import { camelCase } from 'lodash';
import prettier, { BuiltInParserName } from 'prettier';
import { Path } from '@boost/common';
import { LAYERS } from '@aesthetic/system';
import ConfigLoader from './ConfigLoader';
import System from './System';
import SystemTheme from './SystemTheme';
import WebPlatform from './platforms/Web';
import { TargetType, SystemOptions, PlatformType, ConfigFile } from './types';
import {
  BORDER_SIZES,
  BREAKPOINT_SIZES,
  HEADING_SIZES,
  SHADOW_SIZES,
  SPACING_SIZES,
  TEXT_SIZES,
} from './constants';

type Platform = WebPlatform;

const TEMPLATES_FOLDER = Path.resolve('../templates', __dirname);

const PRETTIER_PARSERS: { [ext: string]: BuiltInParserName } = {
  js: 'babel',
  ts: 'typescript',
};

const PRETTIER_IGNORE: { [ext: string]: boolean } = {
  sass: true,
};

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

    // Load the platform
    const platform = this.loadPlatform(system.template.text.df.size);

    // Write the system file
    await this.writeSystemFile(system, platform);

    // Write all theme files
    await Promise.all(
      Array.from(themes.entries()).map(([name, theme]) =>
        this.writeThemeFile(name, theme, platform),
      ),
    );
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

  getTargetFilePath(fileName: string): Path {
    return this.targetPath.append(`${fileName}.${this.getTargetExtension()}`);
  }

  async loadTemplateFile(name: string): Promise<AsyncTemplateFunction> {
    const { target } = this.options;
    const targetFolder = target === 'web-ts' ? 'web-js' : target;
    const templatePath = TEMPLATES_FOLDER.append(targetFolder, `${name}.ejs`);

    return ejs.compile(await fs.promises.readFile(templatePath.path(), 'utf8'), { async: true });
  }

  async writeSystemFile(system: System, platform: Platform) {
    const template = await this.loadTemplateFile('system');

    return this.writeFile(
      this.getTargetFilePath('system'),
      await template({
        borderSizes: BORDER_SIZES,
        breakpointSizes: BREAKPOINT_SIZES,
        headingSizes: HEADING_SIZES,
        layerLevels: LAYERS,
        platform,
        shadowSizes: SHADOW_SIZES,
        spacingSizes: SPACING_SIZES,
        system,
        template: system.template,
        textSizes: TEXT_SIZES,
      }),
    );
  }

  // async writeMixinsFile() {}

  async writeThemeFile(name: string, theme: SystemTheme, platform: Platform) {
    const template = await this.loadTemplateFile('theme');
    const fileName = camelCase(name);

    return this.writeFile(
      this.getTargetFilePath(`themes/${fileName}`),
      await template({
        fileName,
        platform,
        theme,
        template: theme.template,
      }),
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

  protected loadPlatform(rootSize: number): Platform {
    return new WebPlatform(rootSize);
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

      map.set(name, parentTheme.extend(themeConfig, camelCase(extendsFrom)));
    });

    return map;
  }

  protected async writeFile(filePath: Path, data: string): Promise<void> {
    const ext = filePath.ext(true);
    let contents = data;

    // Make sure the target folder exists
    await fs.promises.mkdir(filePath.parent().path(), { recursive: true });

    // Run prettier on the code
    const configPath = await prettier.resolveConfigFile();

    if (configPath && !PRETTIER_IGNORE[ext as 'sass']) {
      const config = (await prettier.resolveConfig(configPath)) || {};

      contents = prettier.format(data, {
        ...config,
        parser: PRETTIER_PARSERS[ext as 'js'] ?? ext,
      });
    }

    // Write the file
    return fs.promises.writeFile(filePath.path(), contents, 'utf8');
  }
}
