import CSS from 'csstype';
import { FontFace } from '../types';

const FORMATS: Record<string, string> = {
  '.eot': 'embedded-opentype',
  '.otf': 'opentype',
  '.svg': 'svg',
  '.svgz': 'svg',
  '.ttf': 'truetype',
  '.woff': 'woff',
  '.woff2': 'woff2',
};

export default function formatFontFace(properties: Partial<FontFace>): CSS.AtRule.FontFace {
  const fontFace = { ...properties };
  const src: string[] = [];

  if (Array.isArray(fontFace.local)) {
    fontFace.local.forEach((alias) => {
      src.push(`local('${alias}')`);
    });

    delete fontFace.local;
  }

  if (Array.isArray(fontFace.srcPaths)) {
    fontFace.srcPaths.forEach((srcPath) => {
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
