import {
	BRAND_FILE,
	BrandLoader,
	CONFIG_FOLDER,
	LANGUAGE_FILE,
	LanguageConfigFile,
	LanguageLoader,
	THEMES_FILE,
	ThemesLoader,
} from '@aesthetic/compiler';
import { Arg, Command, Config, GlobalOptions } from '@boost/cli';
import { parseFile } from '@boost/common';
import { getConfigFolderDir, validateSystemName } from '../helpers';

export type ValidateParams = [string];

@Config('validate', 'Validate a design system configuration')
export class Validate extends Command<GlobalOptions, ValidateParams> {
	@Arg.Params<ValidateParams>({
		description: 'Name of the design system',
		label: 'name',
		required: true,
		type: 'string',
		validate: validateSystemName,
	})
	async run(name: string) {
		const configDir = getConfigFolderDir(name);

		if (!configDir.exists()) {
			throw new Error(`Configuration "${CONFIG_FOLDER}/${name}" does not exist.`);
		}

		this.log('Validating brand config');

		const brandPath = configDir.append(BRAND_FILE);

		new BrandLoader().validate(await parseFile(brandPath), brandPath);

		this.log('Validating language config');

		const languagePath = configDir.append(LANGUAGE_FILE);
		const languageConfig = await parseFile<LanguageConfigFile>(languagePath);

		new LanguageLoader('web').validate(languageConfig, languagePath);

		this.log('Validating themes config');

		const themesPath = configDir.append(THEMES_FILE);

		new ThemesLoader(languageConfig.colors || []).validate(await parseFile(themesPath), themesPath);

		this.log('No issues found');

		// TODO Gather all possible errors and list them?
	}
}
