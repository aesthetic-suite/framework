import { isObject, toArray, objectLoop, arrayLoop } from '@aesthetic/utils';
import { Variables } from '@aesthetic/types';
import Block from './Block';
import formatImport from './helpers/formatImport';
import {
  GlobalStyleSheet,
  Events,
  FontFaceMap,
  ImportList,
  Page,
  LocalBlock,
  Viewport,
  KeyframesMap,
} from './types';
import parseBlock from './parsers/parseBlock';
import parseVariables from './parsers/parseVariables';
import parseLocalBlock from './parsers/parseLocalBlock';
import validateDeclarationBlock from './helpers/validateDeclarationBlock';
import parseKeyframes from './parsers/parseKeyframes';
import parseFontFace from './parsers/parseFontFace';
import createQueue from './helpers/createQueue';
import { PAGE_PSEUDOS } from './constants';

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

function parsePage<T extends object>(page: Page, events: Events<T>) {
  if (__DEV__) {
    validateDeclarationBlock(page, '@page');
  }

  const object = { ...page };

  // Parse each nested selector as its own page block
  PAGE_PSEUDOS.forEach((selector) => {
    const value = object[selector];

    if (value) {
      events.onPage?.(parseBlock(new Block(`@page ${selector}`), value, events));

      delete object[selector];
    }
  });

  // Then parse the root block itself
  if (Object.keys(object).length > 0) {
    events.onPage?.(parseBlock(new Block('@page'), object, events));
  }
}

function parseRoot<T extends object>(globals: LocalBlock, events: Events<T>) {
  events.onRoot?.(parseLocalBlock(new Block('@root'), globals, events));
}

function parseRootVariables<T extends object>(variables: Variables, events: Events<T>) {
  parseVariables(null, variables, events);
}

function parseViewport<T extends object>(viewport: Viewport, events: Events<T>) {
  events.onViewport?.(parseBlock(new Block('@viewport'), viewport, events));
}

export default function parseGlobalStyleSheet<T extends object>(
  styleSheet: GlobalStyleSheet,
  events: Events<T>,
) {
  const queue = createQueue(events);
  queue.add(styleSheet, '@font-face', parseFontFacesMap);
  queue.add(styleSheet, '@import', parseImport);
  queue.add(styleSheet, '@keyframes', parseKeyframesMap);
  queue.add(styleSheet, '@page', parsePage);
  queue.add(styleSheet, '@root', parseRoot);
  queue.add(styleSheet, '@variables', parseRootVariables);
  queue.add(styleSheet, '@viewport', parseViewport);
  queue.process();
}
