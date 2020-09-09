import fs from 'fs-extra';
import optimal, { string } from 'optimal';
import ejs, { TemplateFunction } from 'ejs';
import prettier, { BuiltInParserName } from 'prettier';
import camelCase from 'lodash/camelCase';
import { Path, PortablePath } from '@boost/common';
import {
  createMixins,
  DEPTHS,
  BORDER_SIZES,
  BREAKPOINT_SIZES,
  HEADING_SIZES,
  PALETTE_TYPES,
  SHADE_RANGES,
  SHADOW_SIZES,
  SPACING_SIZES,
  TEXT_SIZES,
  STATE_ORDER,
} from '@aesthetic/system';
import { objectCreate } from '@aesthetic/utils';
import BrandLoader from './BrandLoader';
import LanguageLoader from './LanguageLoader';
import ThemesLoader from './ThemesLoader';
import SystemDesign from './SystemDesign';
import SystemTheme from './SystemTheme';
import WebPlatform from './platforms/Web';
import { FormatType, SystemOptions, PlatformType, MixinsTemplate, ThemesConfigFile } from './types';

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
  readonly configDir: Path;

  readonly options: Required<SystemOptions>;

  readonly targetPath: Path;

  constructor(configDir: PortablePath, targetPath: PortablePath, options: SystemOptions) {
    this.configDir = this.createAndValidatePath(
      configDir,
      'A configuration folder path is required.',
      true,
    );

    this.targetPath = this.createAndValidatePath(
      targetPath,
      'A target destination file path is required.',
    );

    this.options = optimal(options, {
      format: string().oneOf<FormatType>([
        'android',
        'ios',
        'web-css',
        'web-js',
        'web-jsx',
        'web-less',
        'web-sass',
        'web-scss',
        'web-ts',
        'web-tsx',
      ]),
      platform: string().oneOf<PlatformType>(['android', 'ios', 'web']),
    });
  }

  async compile(): Promise<void> {
    // Load and validate the brand config
    const brandLoader = new BrandLoader();
    const brandConfig = await brandLoader.load(this.configDir);

    // Load and validate the design language config
    const languageLoader = new LanguageLoader(this.options.platform);
    const languageConfig = await languageLoader.load(this.configDir);

    // Load and validate the themes config
    const themesLoader = new ThemesLoader(languageConfig.colors);
    const themesConfig = themesLoader.load(this.configDir);

    // Create the design system and theme variants
    const design = new SystemDesign(brandConfig.name, languageConfig, this.options);
    const themes = this.loadThemes(design, themesConfig);

    // Load the platform
    const platform = this.loadPlatform(design);

    // Write the design system and mixin files
    await this.writeMixinsFile(design, platform);
    await this.writeDesignFile(design, platform);

    // Write all theme files
    await Promise.all(
      Array.from(themes.entries()).map(([, theme]) => this.writeThemeFile(design, theme, platform)),
    );
  }

  getFormatExtension(): string {
    switch (this.options.format) {
      // case 'android':
      //   return 'java';
      // case 'ios':
      //   return 'swift';
      case 'web-css':
        return 'css';
      case 'web-less':
        return 'less';
      case 'web-sass':
        return 'sass';
      case 'web-scss':
        return 'scss';
      case 'web-ts':
      case 'web-tsx':
        return 'ts';
      default:
        return 'js';
    }
  }

  getTargetFilePath(...parts: string[]): Path {
    const { format } = this.options;
    let fileName = camelCase(parts.pop());

    if (format === 'web-scss' || format === 'web-sass') {
      fileName = `_${fileName}`;
    }

    fileName += `.${this.getFormatExtension()}`;

    return this.targetPath.append(...parts, fileName);
  }

  async loadTemplate(name: string): Promise<TemplateFunction | null> {
    const templatePath = TEMPLATES_FOLDER.append(this.options.format, `${name}.ejs`);

    // Not all targets use all templates
    if (!templatePath.exists()) {
      return null;
    }

    return ejs.compile(await fs.readFile(templatePath.path(), 'utf8'), {
      filename: templatePath.path(),
    });
  }

  async writeDesignFile(design: SystemDesign, platform: Platform): Promise<void> {
    const template = await this.loadTemplate('design');

    return this.writeFile(
      this.getTargetFilePath('index'),
      await template!({
        data: design.template,
        design,
        borderSizes: BORDER_SIZES,
        breakpointSizes: BREAKPOINT_SIZES,
        elevationDepths: Object.entries(DEPTHS),
        headingSizes: HEADING_SIZES,
        platform,
        shadowSizes: SHADOW_SIZES,
        spacingSizes: SPACING_SIZES,
        textSizes: TEXT_SIZES,
      }),
    );
  }

  async writeMixinsFile(design: SystemDesign, platform: Platform): Promise<void> {
    const template = await this.loadTemplate('mixins');

    if (!template) {
      return Promise.resolve();
    }

    return this.writeFile(
      this.getTargetFilePath('mixins'),
      await template({
        mixins: this.loadMixins(design, platform),
        platform,
      }),
    );
  }

  async writeThemeFile(
    design: SystemDesign,
    theme: SystemTheme,
    platform: Platform,
  ): Promise<void> {
    const template = await this.loadTemplate('theme');

    return this.writeFile(
      this.getTargetFilePath('themes', theme.name),
      await template!({
        data: theme.template,
        design,
        paletteTypes: PALETTE_TYPES,
        platform,
        shadeRanges: SHADE_RANGES,
        stateOrder: STATE_ORDER,
        theme,
      }),
    );
  }

  protected createAndValidatePath(
    filePath: PortablePath,
    message: string,
    exists: boolean = false,
  ): Path {
    if (!filePath || (typeof filePath !== 'string' && !(filePath instanceof Path))) {
      throw new Error(message);
    }

    const path = Path.resolve(filePath);

    if (exists && !path.exists()) {
      throw new Error(`File path "${path.name()}" does not exist.`);
    }

    return path;
  }

  protected loadMixins(design: SystemDesign, platform: Platform): MixinsTemplate {
    const mixins = createMixins(platform.var, {
      breakpoint: objectCreate(BREAKPOINT_SIZES, (size) => {
        const bp = design.template.breakpoint[size];

        return {
          query: platform.query(bp.queryConditions),
          querySize: bp.querySize,
          rootLineHeight: platform.number(bp.rootLineHeight),
          rootTextSize: platform.px(bp.rootTextSize),
        };
      }),
    });

    return {
      'background-brand': mixins.background.brand,
      'background-danger': mixins.background.danger,
      'background-failure': mixins.background.failure,
      'background-info': mixins.background.info,
      'background-muted': mixins.background.muted,
      'background-neutral': mixins.background.neutral,
      'background-primary': mixins.background.primary,
      'background-secondary': mixins.background.secondary,
      'background-success': mixins.background.success,
      'background-tertiary': mixins.background.tertiary,
      'background-warning': mixins.background.warning,
      'border-sm': mixins.border.sm,
      'border-df': mixins.border.df,
      'border-lg': mixins.border.lg,
      'box-sm': mixins.box.sm,
      'box-df': mixins.box.df,
      'box-lg': mixins.box.lg,
      'foreground-brand': mixins.foreground.brand,
      'foreground-danger': mixins.foreground.danger,
      'foreground-failure': mixins.foreground.failure,
      'foreground-info': mixins.foreground.info,
      'foreground-muted': mixins.foreground.muted,
      'foreground-neutral': mixins.foreground.neutral,
      'foreground-primary': mixins.foreground.primary,
      'foreground-secondary': mixins.foreground.secondary,
      'foreground-success': mixins.foreground.success,
      'foreground-tertiary': mixins.foreground.tertiary,
      'foreground-warning': mixins.foreground.warning,
      'heading-l1': mixins.heading.l1,
      'heading-l2': mixins.heading.l2,
      'heading-l3': mixins.heading.l3,
      'heading-l4': mixins.heading.l4,
      'heading-l5': mixins.heading.l5,
      'heading-l6': mixins.heading.l6,
      'pattern-hide-completely': mixins.pattern.hide.completely,
      'pattern-hide-offscreen': mixins.pattern.hide.offscreen,
      'pattern-hide-visually': mixins.pattern.hide.visually,
      'pattern-reset-button': mixins.pattern.reset.button,
      'pattern-reset-input': mixins.pattern.reset.input,
      'pattern-reset-list': mixins.pattern.reset.list,
      'pattern-reset-media': mixins.pattern.reset.media,
      'pattern-reset-typography': mixins.pattern.reset.typography,
      'pattern-text-break': mixins.pattern.text.break,
      'pattern-text-truncate': mixins.pattern.text.truncate,
      'pattern-text-wrap': mixins.pattern.text.wrap,
      root: mixins.pattern.root,
      'shadow-xs': mixins.shadow.xs,
      'shadow-sm': mixins.shadow.sm,
      'shadow-md': mixins.shadow.md,
      'shadow-lg': mixins.shadow.lg,
      'shadow-xl': mixins.shadow.xs,
      'text-sm': mixins.text.sm,
      'text-df': mixins.text.df,
      'text-lg': mixins.text.lg,
    };
  }

  protected loadPlatform(design: SystemDesign): Platform {
    return new WebPlatform(
      this.options.format,
      design.template.text.df.size,
      design.template.spacing.unit,
    );
  }

  protected loadThemes(
    design: SystemDesign,
    themesConfig: ThemesConfigFile,
  ): Map<string, SystemTheme> {
    const themes = { ...themesConfig };
    const map = new Map<string, SystemTheme>();

    // Load all themes that do not extend another theme
    Object.entries(themes.themes).forEach(([name, config]) => {
      if (!config.extends) {
        map.set(name, design.createTheme(name, config));

        delete themes.themes[name];
      }
    });

    // Load themes that do extend another theme
    Object.entries(themes.themes).forEach(([name, config]) => {
      const { extends: extendsFrom, ...themeConfig } = config;
      const parentTheme = map.get(extendsFrom!);

      // Theme existence is validated before hand
      map.set(name, parentTheme!.extend(name, themeConfig, extendsFrom));
    });

    return map;
  }

  protected async writeFile(filePath: Path, data: string): Promise<void> {
    const ext = filePath.ext(true);
    let contents = data;

    // Make sure the target folder exists
    await fs.ensureDir(filePath.parent().path());

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
    return fs.writeFile(filePath.path(), contents, 'utf8');
  }
}
