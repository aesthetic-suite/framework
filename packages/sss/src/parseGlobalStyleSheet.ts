import { isObject, toArray, objectLoop, arrayLoop } from '@aesthetic/utils';
import { Variables } from '@aesthetic/types';
import Block from './Block';
import formatImport from './helpers/formatImport';
import {
  GlobalStyleSheet,
  Events,
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

function parseFontFacesMap<T extends object>(fontFaces: FontFaceMap, events: Events<T>) {
  if (__DEV__) {
    if (!isObject(fontFaces)) {
      throw new Error('@font-face must be an object of font family names to font faces.');
    }
  }

  objectLoop(fontFaces, (faces, name) => {
    arrayLoop(toArray(faces), (fontFace) => {
      parseFontFace(fontFace, name, events);
    });
  });
}

function parseImport<T extends object>(imports: ImportList, events: Events<T>) {
  if (__DEV__) {
    if (!Array.isArray(imports)) {
      throw new TypeError('@import must be an array of strings or import objects.');
    }
  }

  arrayLoop(imports, (value) => {
    events.onImport?.(formatImport(value));
  });
}

function parseKeyframesMap<T extends object>(keyframes: KeyframesMap, events: Events<T>) {
  if (__DEV__) {
    if (!isObject(keyframes)) {
      throw new Error('@keyframes must be an object of animation names to keyframes.');
    }
  }

  objectLoop(keyframes, (keyframe, name) => {
    parseKeyframes(keyframe, name, events);
  });
}

function parseRoot<T extends object>(globals: LocalBlock, events: Events<T>) {
  const block = parseLocalBlock(new Block('@root'), globals, events);

  events.onRoot?.(block);
}

function parseRootVariables<T extends object>(variables: Variables, events: Events<T>) {
  parseVariables(null, variables, events);
}

export default function parseGlobalStyleSheet<T extends object>(
  styleSheet: GlobalStyleSheet,
  events: Events<T>,
) {
  const queue = createQueue(events);
  queue.add(styleSheet, '@font-face', parseFontFacesMap);
  queue.add(styleSheet, '@import', parseImport);
  queue.add(styleSheet, '@keyframes', parseKeyframesMap);
  queue.add(styleSheet, '@root', parseRoot);
  queue.add(styleSheet, '@variables', parseRootVariables);
  queue.process();
}
