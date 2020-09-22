import { objectLoop } from '@aesthetic/utils';
import Block from '../Block';
import validateDeclarationBlock from '../helpers/validateDeclarationBlock';
import { Events, Keyframes } from '../types';
import parseBlock from './parseBlock';

export default function parseKeyframes<T extends object>(
  object: Keyframes,
  animationName: string,
  events: Events<T>,
): string {
  const keyframes = new Block<T>(`@keyframes`);

  if (__DEV__) {
    validateDeclarationBlock(object, keyframes.selector);
  }

  // from, to, and percent keys aren't easily detectable
  objectLoop(object, (value, key) => {
    if (value !== undefined) {
      parseBlock(keyframes.addNested(new Block(key)), value, events);
    }
  });

  // Inherit the name from the listener as it may be generated
  return events.onKeyframes?.(keyframes, animationName) || animationName || '';
}
