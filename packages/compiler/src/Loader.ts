import { Path, parseFile } from '@boost/common';
import { DeepPartial } from '@aesthetic/system';
import { deepMerge } from '@aesthetic/utils';
import { ConfigFile } from './types';

export default abstract class Loader<T extends ConfigFile> {
  load(configDir: Path): T {
    const filePath = configDir.path().endsWith('.yaml')
      ? configDir
      : configDir.append(this.getFileName());
    let config = parseFile<DeepPartial<T>>(filePath);

    // Extend from parent config
    if (config.extends && typeof config.extends === 'string') {
      config = deepMerge(this.load(configDir.parent().append(config.extends)), config);
    }

    return this.validate(config, filePath);
  }

  abstract getFileName(): string;

  abstract validate(config: DeepPartial<T>, filePath: Path): T;
}
