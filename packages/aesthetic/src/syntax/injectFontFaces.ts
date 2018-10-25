/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { FontFace } from '../types';

/**
 * Replace a `fontFamily` property with font face objects of the same name.
 */
export default function injectFontFaces(
  value: string,
  cache: { [fontFamily: string]: FontFace[] },
): (string | FontFace)[] {
  const fontFaces: (string | FontFace)[] = [];

  value.split(',').forEach(name => {
    const familyName = name.trim();
    const fonts = cache[familyName];

    if (Array.isArray(fonts)) {
      fontFaces.push(...fonts);
    } else {
      fontFaces.push(familyName);
    }
  });

  return fontFaces;
}
