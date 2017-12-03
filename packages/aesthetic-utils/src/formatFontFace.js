/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

const FORMATS: { [ext: string]: string } = {
  '.eot': 'embedded-opentype',
  '.otf': 'opentype',
  '.svg': 'svg',
  '.svgz': 'svg',
  '.ttf': 'truetype',
  '.woff': 'woff',
  '.woff2': 'woff2',
};

export default function formatFontFace(
  properties: StyleDeclaration,
  flattenSrc?: boolean = false,
): StyleDeclaration {
  const fontFace = { ...properties };

  if (!flattenSrc || (flattenSrc && typeof fontFace.src === 'string')) {
    return fontFace;
  }

  const src = [];

  if (fontFace.localAlias) {
    fontFace.localAlias.forEach((alias) => {
      src.push(`local('${alias}')`);
    });

    delete fontFace.localAlias;
  }

  fontFace.src.forEach((srcPath) => {
    const ext = srcPath.slice(srcPath.lastIndexOf('.'));

    if (!FORMATS[ext] && __DEV__) {
      throw new Error(`Unsupported font format "${ext}".`);
    }

    src.push(`url('${srcPath}') format('${FORMATS[ext]}')`);
  });

  fontFace.src = src.join(', ');

  return fontFace;
}
