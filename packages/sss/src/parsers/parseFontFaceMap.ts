import { arrayLoop, isObject, objectLoop, toArray } from '@aesthetic/utils';
import { FontFaceMap, ParserOptions } from '../types';
import parseFontFace from './parseFontFace';

export default function parseFontFaceMap<T extends object>(
  fontFaces: FontFaceMap,
  options: ParserOptions<T>,
) {
  if (__DEV__) {
    if (!isObject(fontFaces)) {
      throw new Error('@font-face must be an object of font family names to font faces.');
    }
  }

  objectLoop(fontFaces, (faces, name) => {
    arrayLoop(toArray(faces), (fontFace) => {
      parseFontFace(fontFace, name, options);
    });
  });
}
