import { Path } from '@boost/common';
import { Arg, Config, Command, GlobalOptions } from '@boost/cli';
import { Compiler, FormatType, PlatformType } from '@aesthetic/compiler';
import { validateSystemName, getConfigFolderDir } from '../helpers';
import { FORMAT_LIST, CWD } from '../constants';

export interface CompileOptions extends GlobalOptions {
  format: FormatType;
}

export type CompileParams = [string, string];

@Config('compile', 'Compile a design system configuration into a platform specific format')
export default class Compile extends Command<CompileOptions, CompileParams> {
  @Arg.String('Current working directory')
  cwd: string = CWD;

  @Arg.String('Target platform and format', { choices: FORMAT_LIST })
  format: FormatType = 'web-tsx';

  @Arg.Params<CompileParams>(
    {
      description: 'Name of the design system',
      label: 'name',
      required: true,
      type: 'string',
      validate: validateSystemName,
    },
    {
      description: 'Directory in which to write files to',
      label: 'target',
      required: true,
      type: 'string',
    },
  )
  async run(name: string, target: string) {
    const configDir = getConfigFolderDir(name);
    const targetPath = Path.resolve(target, this.cwd);
    const compiler = new Compiler(configDir, targetPath, {
      format: this.format,
      platform: this.format.split('-')[0] as PlatformType,
    });

    await compiler.compile();

    this.log('Compiled %s files to %s', this.format, targetPath);
  }
}
