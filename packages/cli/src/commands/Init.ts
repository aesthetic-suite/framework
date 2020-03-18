import fs from 'fs';
import path from 'path';
import { parse, Argv } from '@boost/args';

export default async function init(argv: Argv) {
  const args = parse<{ scaled: boolean }, [string]>(argv, {
    options: {
      scaled: {
        description: 'Generate a modular scaled based configuration file.',
        type: 'boolean',
      },
    },
    params: [
      {
        default: process.cwd(),
        description: 'Directory in which to copy files to',
        label: 'cwd',
        type: 'string',
      },
    ],
  });

  const [cwd] = args.params;
  const configPath = require.resolve(
    `@aesthetic/compiler/templates/${args.options.scaled ? 'config' : 'config-fixed'}.yaml`,
  );

  console.log(`Creating config file in ${cwd}`);

  await fs.promises.copyFile(configPath, path.join(cwd, 'aesthetic.yaml'));

  console.log('Created!');
}
