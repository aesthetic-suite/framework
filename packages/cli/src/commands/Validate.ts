import { Path, parseFile } from '@boost/common';
import { Arg, Config, Command, GlobalOptions } from '@boost/cli';
import { ConfigLoader } from '@aesthetic/compiler';
import { CWD } from '../constants';

export interface ValidateOptions extends GlobalOptions {
  config: string;
}

@Config('validate', 'Validate a configuration file')
export default class Validate extends Command<ValidateOptions> {
  @Arg.String('Relative path to the configuration file')
  config: string = '';

  async run() {
    const configPath = Path.resolve(this.config, CWD);

    if (!configPath.exists()) {
      throw new Error(`Configuration file "${configPath}" does not exist.`);
    }

    this.log('Validating config file %s', configPath);

    new ConfigLoader('web').validate(await parseFile(configPath));

    this.log('No issues found');

    // TODO gather all possible errors and list them?
  }
}
