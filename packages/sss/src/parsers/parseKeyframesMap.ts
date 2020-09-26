import { isObject, objectLoop } from '@aesthetic/utils';
import { KeyframesMap, ParserOptions } from '../types';
import parseKeyframes from './parseKeyframes';

export default function parseKeyframesMap<T extends object>(
  keyframes: KeyframesMap,
  options: ParserOptions<T>,
) {
  if (__DEV__) {
    if (!isObject(keyframes)) {
      throw new Error('@keyframes must be an object of animation names to keyframes.');
    }
  }

  objectLoop(keyframes, (keyframe, name) => {
    parseKeyframes(keyframe, name, options);
  });
}
