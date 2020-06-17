import fs from 'fs-extra';
import { Path } from '@boost/common';
import { Arg, Config, Command, GlobalOptions } from '@boost/cli';
import { getConfigFolderPath, validateSystemName } from '../helpers';
import {
  CONFIG_FOLDER,
  BRAND_FILE,
  LANGUAGE_FILE,
  LANGUAGE_SCALED_FILE,
  THEMES_FILE,
} from '../constants';

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
    const targetFolder = getConfigFolderPath(name);

    await fs.ensureDir(targetFolder.path());
    await this.createBrandConfig(targetFolder, name);
    await this.createLanguageConfig(targetFolder);
    await this.createThemesConfig(targetFolder);

    this.log('Initialized design system to "%s/%s"', CONFIG_FOLDER, name);

    // TODO Add enquirer integration and ask basic questions to inject into the yaml file
  }

  async createBrandConfig(targetFolder: Path, name: string) {
    let contents = await fs.readFile(
      require.resolve(`@aesthetic/cli/templates/${BRAND_FILE}`),
      'utf8',
    );

    // Inject the design system name
    contents = contents.replace('example-name', name);

    await fs.writeFile(targetFolder.append(BRAND_FILE).path(), contents, 'utf8');
  }

  async createLanguageConfig(targetFolder: Path) {
    await fs.copyFile(
      require.resolve(
        `@aesthetic/cli/templates/${this.modularScale ? LANGUAGE_SCALED_FILE : LANGUAGE_FILE}`,
      ),
      targetFolder.append(LANGUAGE_FILE).path(),
    );
  }

  async createThemesConfig(targetFolder: Path) {
    await fs.copyFile(
      require.resolve(`@aesthetic/cli/templates/${THEMES_FILE}`),
      targetFolder.append(THEMES_FILE).path(),
    );
  }
}
