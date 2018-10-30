/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/**
 * Replace a `fontFamily` property with font face objects of the same name.
 */
export default function injectFontFaces<D>(
  value: string,
  cache: { [fontFamily: string]: D[] },
): (string | D)[] {
  const fontFaces: (string | D)[] = [];

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
