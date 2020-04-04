import fs from 'fs-extra';
import { Path } from '@boost/common';
import { Arg, Config, Command, GlobalOptions } from '@boost/cli';
import { CONFIG_FILE, CWD } from '../constants';

export interface InitOptions extends GlobalOptions {
  modularScale: boolean;
}

@Config('init', 'Generate a design system configuration file')
export default class Init extends Command<InitOptions, [string]> {
  @Arg.Flag('Generate a modular scaled based configuration file')
  modularScale: boolean = false;

  @Arg.Params({
    description: 'Directory in which to create file',
    label: 'cwd',
    type: 'string',
  })
  async run(cwd: string = CWD) {
    const targetPath = new Path(cwd);
    const configPath = targetPath.append(CONFIG_FILE);
    const templatePath = new Path(
      require.resolve(
        `@aesthetic/compiler/templates/${this.modularScale ? 'config' : 'config-fixed'}.yaml`,
      ),
    );

    if (!targetPath.exists()) {
      throw new Error(`Target directory "${targetPath}" does not exist.`);
    }

    this.log('Creating config file in %s', targetPath);

    await fs.copyFile(templatePath.path(), configPath.path());

    this.log('Created %s!', CONFIG_FILE);

    // TODO Add enquirer integration and ask basic questions to inject into the yaml file
  }
}
