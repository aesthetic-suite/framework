import { DeepPartial } from '@aesthetic/system';
import { Path } from '@boost/common';
import optimal, { string } from 'optimal';
import { BRAND_FILE, NAME_PATTERN } from './constants';
import { BrandConfigFile } from './types';
import Loader from './Loader';

export default class BrandLoader extends Loader<BrandConfigFile> {
  getFileName() {
    return BRAND_FILE;
  }

  validate(config: DeepPartial<BrandConfigFile>, filePath: Path): BrandConfigFile {
    return optimal(
      config,
      {
        extends: string(),
        name: string().notEmpty().match(NAME_PATTERN),
      },
      { file: filePath.path() },
    );
  }
}
