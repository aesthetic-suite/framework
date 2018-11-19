/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import toArray from '../helpers/toArray';
import { FontFace, Omit } from '../types';

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
  properties: Partial<FontFace>,
): Omit<FontFace, 'local' | 'srcPaths'> {
  const fontFace = { ...properties };
  const src: string[] = [];

  if (fontFace.local) {
    toArray(fontFace.local).forEach(alias => {
      src.push(`local('${String(alias)}')`);
    });

    delete fontFace.local;
  }

  if (Array.isArray(fontFace.srcPaths)) {
    toArray(fontFace.srcPaths).forEach(srcPath => {
      let ext = srcPath.slice(srcPath.lastIndexOf('.'));

      if (ext.indexOf('?') >= 0) {
        [ext] = ext.split('?');
      }

      if (FORMATS[ext]) {
        src.push(`url('${srcPath}') format('${FORMATS[ext]}')`);
      } else if (process.env.NODE_ENV !== 'production') {
        throw new Error(`Unsupported font format "${ext}".`);
      }
    });

    delete fontFace.srcPaths;
  } else {
    return fontFace;
  }

  fontFace.src = src.join(', ');

  return fontFace;
}
