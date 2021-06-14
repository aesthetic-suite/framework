import ejs, { TemplateFunction } from 'ejs';
import fs from 'fs-extra';
import camelCase from 'lodash/camelCase';
import optimal, { bool, string } from 'optimal';
import prettier, { BuiltInParserName } from 'prettier';
import { PALETTE_TYPES } from '@aesthetic/system';
import { Path, PortablePath } from '@boost/common';
import BrandLoader from './BrandLoader';
import {
	BORDER_SIZES,
	BREAKPOINT_SIZES,
	DEPTHS,
	HEADING_SIZES,
	SHADE_RANGES,
	SHADOW_SIZES,
	SPACING_SIZES,
	STATE_ORDER,
	TEXT_SIZES,
} from './constants';
import LanguageLoader from './LanguageLoader';
import Platform from './Platform';
import NativePlatform from './platforms/Native';
import WebPlatform from './platforms/Web';
import SystemDesign from './SystemDesign';
import SystemTheme from './SystemTheme';
import ThemesLoader from './ThemesLoader';
import { FormatType, PlatformType, SystemOptions, ThemesConfigFile } from './types';

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
				'native-js',
				'native-jsx',
				'native-ts',
				'native-tsx',
				'web-css',
				'web-js',
				'web-jsx',
				'web-less',
				'web-sass',
				'web-scss',
				'web-ts',
				'web-tsx',
			]),
			mixins: bool(),
			platform: string().oneOf<PlatformType>(['android', 'ios', 'native', 'web']),
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

		// Write the design system
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
			case 'native-ts':
			case 'native-tsx':
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

		const template = [
			'/* Auto-generated by Aesthetic. Do not modify! */',
			'/* eslint-disable */',
			'',
			await fs.readFile(templatePath.path(), 'utf8'),
		].join('\n');

		return ejs.compile(template, {
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

	protected loadPlatform(design: SystemDesign): Platform {
		const args = [
			this.options.format,
			design.template.text.df.size,
			design.template.spacing.unit,
		] as const;

		if (this.options.format.startsWith('native')) {
			return new NativePlatform(...args);
		}

		return new WebPlatform(...args);
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
