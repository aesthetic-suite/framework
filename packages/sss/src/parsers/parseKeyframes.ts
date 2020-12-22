import { objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import { ParserOptions, Keyframes } from '../types';
import parseBlock from './parseBlock';

export default function parseKeyframes<T extends object>(
  object: Keyframes,
  animationName: string,
  options: ParserOptions<T>,
): string {
  const keyframes = new Block<T>('@keyframes');

  if (__DEV__) {
    validateDeclarationBlock(object, keyframes.id);
  }

  // from, to, and percent keys aren't easily detectable
  objectLoop(object, (value, key) => {
    if (value !== undefined) {
      parseBlock(keyframes.nest(new Block(key)), value, options, false);
    }
  });

  // Inherit the name from the listener as it may be generated
  return options.onKeyframes?.(keyframes, animationName) || animationName || '';
}
