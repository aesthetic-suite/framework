import { Path } from '@boost/common';
import { Arg, Config, Command, GlobalOptions } from '@boost/cli';
import { Compiler, TargetType, PlatformType } from '@aesthetic/compiler';
import { CONFIG_FILE, FORMAT_LIST, CWD } from '../constants';

export interface CompileOptions extends GlobalOptions {
  config: string;
  format: TargetType;
}

export type CompileParams = [];

@Config('compile', 'Compile a configuration file into a platform specific format')
export default class Compile extends Command<CompileOptions, [string]> {
  @Arg.String('Relative path to the configuration file')
  config: string = CONFIG_FILE;

  @Arg.String('Target platform and technology format', { choices: FORMAT_LIST })
  format: TargetType = 'web-js';

  @Arg.Params({
    description: 'Directory in which to write files to',
    label: 'target',
    required: true,
    type: 'string',
  })
  async run(target: string) {
    const configPath = Path.resolve(this.config, CWD);
    const targetPath = Path.resolve(target, CWD);
    const compiler = new Compiler(configPath, targetPath, {
      platform: this.format.split('-')[0] as PlatformType,
      target: this.format,
    });

    this.log('Compiling %s files to %s', this.format, targetPath);

    await compiler.compile();

    this.log('Compiled files!');
  }
}
