import path from 'path';
import { parse, Argv } from '@boost/args';
import { Compiler, TargetType, PlatformType } from '@aesthetic/compiler';

interface CompileOptions {
  config: string;
  format: TargetType;
}

export default async function compile(argv: Argv) {
  const args = parse<CompileOptions, [string]>(argv, {
    options: {
      config: {
        default: 'aesthetic.yaml',
        description: 'Relative path to the configuration file.',
        type: 'string',
      },
      format: {
        choices: [
          'android',
          'ios',
          'web-cjs',
          'web-css',
          'web-less',
          'web-sass',
          'web-scss',
          'web-js',
          'web-ts',
        ] as 'web-js'[],
        default: 'web-js' as const,
        description: 'Target platform and technology format.',
        type: 'string',
      },
    },
    params: [
      {
        description: 'Directory in which to write files to',
        label: 'target',
        required: true,
        type: 'string',
      },
    ],
  });
  const cwd = process.cwd();
  const { config: configPath, format } = args.options;
  const [targetPath] = args.params;

  const compiler = new Compiler(path.resolve(cwd, configPath), path.resolve(cwd, targetPath), {
    platform: format.split('-')[0] as PlatformType,
    target: format,
  });

  console.log(`Compiling ${format} files to ${targetPath}`);

  await compiler.compile();

  console.log('Compiled files!');
}
