import fs from 'fs-extra';
import { BRAND_FILE, CONFIG_FOLDER, LANGUAGE_FILE, THEMES_FILE } from '@aesthetic/compiler';
import { Arg, Command, Config, GlobalOptions } from '@boost/cli';
import { Path } from '@boost/common';
import { getConfigFolderDir, validateSystemName } from '../helpers';

export interface InitOptions extends GlobalOptions {
	modularScale: boolean;
}

export type InitParams = [string];

@Config('init', 'Generate a design system configuration')
export default class Init extends Command<InitOptions, InitParams> {
	@Arg.Flag('Generate a modular scale based configuration')
	modularScale: boolean = false;

	@Arg.Params<InitParams>({
		description: 'Name of the design system',
		label: 'name',
		required: true,
		type: 'string',
		validate: validateSystemName,
	})
	async run(name: string) {
		const configDir = getConfigFolderDir(name);

		await fs.ensureDir(configDir.path());

		await this.createBrandConfig(configDir, name);
		await this.createLanguageConfig(configDir);
		await this.createThemesConfig(configDir);

		this.log('Initialized design system to "%s/%s"', CONFIG_FOLDER, name);

		// TODO Add enquirer integration and ask basic questions to inject into the yaml file
	}

	async createBrandConfig(configDir: Path, name: string) {
		let contents = await fs.readFile(
			require.resolve(`@aesthetic/cli/templates/${BRAND_FILE}`),
			'utf8',
		);

		// Inject the design system name
		contents = contents.replace('example-name', name);

		await fs.writeFile(configDir.append(BRAND_FILE).path(), contents, 'utf8');
	}

	async createLanguageConfig(configDir: Path) {
		await fs.copyFile(
			require.resolve(
				`@aesthetic/cli/templates/${
					this.modularScale ? LANGUAGE_FILE.replace('language', 'language-scaled') : LANGUAGE_FILE
				}`,
			),
			configDir.append(LANGUAGE_FILE).path(),
		);
	}

	async createThemesConfig(configDir: Path) {
		await fs.copyFile(
			require.resolve(`@aesthetic/cli/templates/${THEMES_FILE}`),
			configDir.append(THEMES_FILE).path(),
		);
	}
}
