import { objectLoop, toArray } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import { FallbackProperties, ParserOptions } from '../types';

export default function parseFallbacks<T extends object>(
  parent: Block<T>,
  fallbacks: FallbackProperties,
  options: ParserOptions<T>,
) {
  if (__DEV__) {
    validateDeclarationBlock(fallbacks, '@fallbacks');
  }

  objectLoop(fallbacks, (value, prop) => {
    const values = toArray(value);
    const current = parent.properties[prop];

    if (current) {
      // This is technically invalid since block doesn't support arrays,
      // but the style renderer does. This is the only use case for arrays,
      // so let's just ignore it here for type safety everywhere else.
      // @ts-expect-error
      parent.properties[prop] = [...values, current];

      options.onFallback?.(parent, prop, values);
    }
  });
}
