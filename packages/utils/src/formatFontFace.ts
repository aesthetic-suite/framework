import { Omit } from 'utility-types';
import toArray from './toArray';

interface FontFaceLike {
  local?: string[];
  src?: string;
  srcPaths?: string | string[];
  [key: string]: unknown;
}

const FORMATS: { [ext: string]: string } = {
  '.eot': 'embedded-opentype',
  '.otf': 'opentype',
  '.svg': 'svg',
  '.svgz': 'svg',
  '.ttf': 'truetype',
  '.woff': 'woff',
  '.woff2': 'woff2',
};

export default function formatFontFace<T extends FontFaceLike>(
  properties: Partial<T>,
): Omit<T, 'local' | 'srcPaths'> {
  const fontFace: any = { ...properties };
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

      if (ext.includes('?')) {
        [ext] = ext.split('?');
      }

      if (FORMATS[ext]) {
        src.push(`url('${srcPath}') format('${FORMATS[ext]}')`);
      } else if (__DEV__) {
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