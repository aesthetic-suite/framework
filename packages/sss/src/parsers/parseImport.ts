import { arrayLoop } from '@aesthetic/utils';
import formatImport from '../helpers/formatImport';
import { ImportList, ParserOptions } from '../types';

export default function parseImport<T extends object>(
  imports: ImportList,
  options: ParserOptions<T>,
) {
  if (__DEV__) {
    if (!Array.isArray(imports)) {
      throw new TypeError('@import must be an array of strings or import objects.');
    }
  }

  arrayLoop(imports, (value) => {
    options.onImport?.(formatImport(value));
  });
}
