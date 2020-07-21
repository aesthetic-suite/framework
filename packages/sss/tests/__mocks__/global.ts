/* eslint-disable sort-keys */

import CSS from 'csstype';
import { FontFace, Keyframes, GlobalStyleSheet } from '../../src/types';

export const FONT_ROBOTO: FontFace = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  local: ['Robo'],
  srcPaths: ['fonts/Roboto.woff2', 'fonts/Roboto.ttf'],
};

export const FONT_ROBOTO_FLAT_SRC: CSS.FontFace = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  src:
    "local('Robo'), url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype')",
};

export const FONTS_CIRCULAR: FontFace[] = [
  {
    fontFamily: 'Circular',
    fontStyle: 'normal',
    fontWeight: 'normal',
    srcPaths: ['fonts/Circular.woff2'],
  },
  {
    fontFamily: 'Circular',
    fontStyle: 'italic',
    fontWeight: 'normal',
    srcPaths: ['fonts/Circular-Italic.woff2'],
  },
  {
    fontFamily: 'Circular',
    fontStyle: 'normal',
    fontWeight: 300,
    srcPaths: ['fonts/Circular-Light.woff2'],
  },
  {
    fontFamily: 'Circular',
    fontStyle: 'normal',
    fontWeight: 700,
    srcPaths: ['fonts/Circular-Bold.woff2'],
  },
];

export const FONTS_CIRCULAR_FLAT_SRC: CSS.FontFace[] = [
  {
    fontFamily: 'Circular',
    fontStyle: 'normal',
    fontWeight: 'normal',
    src: "url('fonts/Circular.woff2') format('woff2')",
  },
  {
    fontFamily: 'Circular',
    fontStyle: 'italic',
    fontWeight: 'normal',
    src: "url('fonts/Circular-Italic.woff2') format('woff2')",
  },
  {
    fontFamily: 'Circular',
    fontStyle: 'normal',
    fontWeight: 300,
    src: "url('fonts/Circular-Light.woff2') format('woff2')",
  },
  {
    fontFamily: 'Circular',
    fontStyle: 'normal',
    fontWeight: 700,
    src: "url('fonts/Circular-Bold.woff2') format('woff2')",
  },
];

export const KEYFRAMES_RANGE: Keyframes = {
  from: { opacity: 0 },
  to: { opacity: 1 },
};

export const KEYFRAMES_PERCENT: Keyframes = {
  '0%': { left: '0%' },
  '50%': { left: '50%' },
  '100%': { left: '100%' },
};

export const SYNTAX_ROOT: GlobalStyleSheet['@root'] = {
  height: '100%',
  margin: 0,
  fontSize: 16,
  lineHeight: 1.5,
  backgroundColor: 'white',
  '@media': {
    '(prefers-color-scheme: dark)': {
      backgroundColor: 'black',
    },
  },
};
