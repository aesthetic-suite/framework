import fs from 'fs-extra';
import { Path } from '@boost/common';
import { Arg, Config, Command, GlobalOptions } from '@boost/cli';
import { CONFIG_FILE } from '../constants';

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
  async run(cwd: string = process.cwd()) {
    const configPath = Path.resolve(CONFIG_FILE, cwd);
    const templatePath = new Path(
      require.resolve(
        `@aesthetic/compiler/templates/${this.modularScale ? 'config' : 'config-fixed'}.yaml`,
      ),
    );

    this.log('Creating config file in %s', cwd);

    await fs.copyFile(templatePath.path(), configPath.path());

    this.log('Created!');
  }
}
