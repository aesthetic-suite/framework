import optimal, { string } from 'optimal';
import { DeepPartial } from '@aesthetic/system';
import { Path } from '@boost/common';
import { BRAND_FILE } from './constants';
import { Loader } from './Loader';
import { BrandConfigFile } from './types';

export class BrandLoader extends Loader<BrandConfigFile> {
	getFileName() {
		return BRAND_FILE;
	}

	validate(config: DeepPartial<BrandConfigFile>, filePath: Path): BrandConfigFile {
		return optimal(
			config,
			{
				extends: string(),
				name: string().notEmpty(),
			},
			{ file: filePath.path() },
		);
	}
}
