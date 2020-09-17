import { objectLoop, toArray } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import { Events, FallbackProperties } from '../types';

export default function parseFallbackProperties<T extends object>(
  parent: Block<T>,
  fallbacks: FallbackProperties,
  events: Events<T>,
) {
  if (__DEV__) {
    validateDeclarationBlock(fallbacks, '@fallbacks');
  }

  objectLoop(fallbacks, (value, prop) => {
    events.onBlockFallback?.(parent, prop, toArray(value));
  });
}
