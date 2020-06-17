import { DeepPartial } from '@aesthetic/system';
import { Path, parseFile } from '@boost/common';
import optimal, { string } from 'optimal';
import { BRAND_FILE } from './constants';
import { BrandConfigFile } from './types';

export default class BrandLoader {
  load(configDir: Path): BrandConfigFile {
    const filePath = configDir.append(BRAND_FILE);
    const config = parseFile<DeepPartial<BrandConfigFile>>(filePath);

    return this.validate(config, filePath);
  }

  validate(config: DeepPartial<BrandConfigFile>, filePath: Path): BrandConfigFile {
    return optimal(config, { name: string().notEmpty() }, { file: filePath.path() });
  }
}
