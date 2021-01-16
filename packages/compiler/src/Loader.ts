import { DeepPartial } from '@aesthetic/system';
import { deepMerge } from '@aesthetic/utils';
import { parseFile, Path } from '@boost/common';
import { ConfigFile } from './types';

export default abstract class Loader<T extends ConfigFile> {
  load(configDir: Path): T {
    let filePath: Path;
    let parentDir: Path;

    if (configDir.path().endsWith('.yaml')) {
      filePath = configDir;
      parentDir = configDir.parent();
    } else {
      filePath = configDir.append(this.getFileName());
      parentDir = configDir;
    }

    let config = parseFile<DeepPartial<T>>(filePath);

    // Extend from parent config
    if (config.extends && typeof config.extends === 'string') {
      config = deepMerge(this.load(parentDir.append(config.extends)), config);
    }

    return this.validate(config, filePath);
  }

  abstract getFileName(): string;

  abstract validate(config: DeepPartial<T>, filePath: Path): T;
}
