import { isObject, toArray, objectLoop, arrayLoop } from '@aesthetic/utils';
import { Variables } from '@aesthetic/types';
import Block from './Block';
import formatImport from './helpers/formatImport';
import {
  GlobalStyleSheet,
  ParserOptions,
  FontFaceMap,
  ImportList,
  LocalBlock,
  KeyframesMap,
} from './types';
import parseVariables from './parsers/parseVariables';
import parseLocalBlock from './parsers/parseLocalBlock';
import parseKeyframes from './parsers/parseKeyframes';
import parseFontFace from './parsers/parseFontFace';
import createQueue from './helpers/createQueue';

function parseFontFacesMap<T extends object>(fontFaces: FontFaceMap, options: ParserOptions<T>) {
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

function parseImport<T extends object>(imports: ImportList, options: ParserOptions<T>) {
  if (__DEV__) {
    if (!Array.isArray(imports)) {
      throw new TypeError('@import must be an array of strings or import objects.');
    }
  }

  arrayLoop(imports, (value) => {
    options.onImport?.(formatImport(value));
  });
}

function parseKeyframesMap<T extends object>(keyframes: KeyframesMap, options: ParserOptions<T>) {
  if (__DEV__) {
    if (!isObject(keyframes)) {
      throw new Error('@keyframes must be an object of animation names to keyframes.');
    }
  }

  objectLoop(keyframes, (keyframe, name) => {
    parseKeyframes(keyframe, name, options);
  });
}

function parseRoot<T extends object>(globals: LocalBlock, options: ParserOptions<T>) {
  const block = parseLocalBlock(new Block('@root'), globals, options);

  options.onRoot?.(block);
}

function parseRootVariables<T extends object>(variables: Variables, options: ParserOptions<T>) {
  parseVariables(null, variables, options);
}

export default function parseGlobalStyleSheet<T extends object>(
  styleSheet: GlobalStyleSheet,
  options: ParserOptions<T>,
) {
  const queue = createQueue(options);
  queue.add(styleSheet, '@font-face', parseFontFacesMap);
  queue.add(styleSheet, '@import', parseImport);
  queue.add(styleSheet, '@keyframes', parseKeyframesMap);
  queue.add(styleSheet, '@root', parseRoot);
  queue.add(styleSheet, '@variables', parseRootVariables);
  queue.process();
}
