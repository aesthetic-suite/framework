import { isObject, toArray, objectLoop, arrayLoop } from '@aesthetic/utils';
import Block from './Block';
import formatImport from './helpers/formatImport';
import { GlobalStyleSheet, PagePseudos, Events } from './types';
import parseBlock from './parsers/parseBlock';
import parseVariables from './parsers/parseVariables';
import parseLocalBlock from './parsers/parseLocalBlock';
import validateDeclarationBlock from './helpers/validateDeclarationBlock';
import parseKeyframes from './parsers/parseKeyframes';
import parseFontFace from './parsers/parseFontFace';

function parseFontFacesMap<T extends object>(
  fontFaces: GlobalStyleSheet['@font-face'],
  events: Events<T>,
) {
  if (!fontFaces) {
    return;
  }

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

function parseImport<T extends object>(imports: GlobalStyleSheet['@import'], events: Events<T>) {
  if (!imports) {
    return;
  }

  if (__DEV__) {
    if (!Array.isArray(imports)) {
      throw new TypeError('@import must be an array of strings or import objects.');
    }
  }

  arrayLoop(imports, (value) => {
    events.onImport?.(formatImport(value));
  });
}

function parseKeyframesMap<T extends object>(
  keyframes: GlobalStyleSheet['@keyframes'],
  events: Events<T>,
) {
  if (!keyframes) {
    return;
  }

  if (__DEV__) {
    if (!isObject(keyframes)) {
      throw new Error('@keyframes must be an object of animation names to keyframes.');
    }
  }

  objectLoop(keyframes, (keyframe, name) => {
    parseKeyframes(keyframe, name, events);
  });
}

function parsePage<T extends object>(page: GlobalStyleSheet['@page'], events: Events<T>) {
  if (!page) {
    return;
  }

  if (__DEV__) {
    validateDeclarationBlock(page, '@page');
  }

  const object = { ...page };
  const pseudos: PagePseudos[] = [':blank', ':first', ':left', ':right'];

  // Parse each nested selector as its own page block
  pseudos.forEach((selector) => {
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

function parseRoot<T extends object>(globals: GlobalStyleSheet['@root'], events: Events<T>) {
  if (globals) {
    events.onRoot?.(parseLocalBlock(new Block('@root'), globals, events));
  }
}

function parseRootVariables<T extends object>(
  variables: GlobalStyleSheet['@variables'],
  events: Events<T>,
) {
  if (variables) {
    parseVariables(null, variables, events);
  }
}

function parseViewport<T extends object>(
  viewport: GlobalStyleSheet['@viewport'],
  events: Events<T>,
) {
  if (viewport) {
    events.onViewport?.(parseBlock(new Block('@viewport'), viewport, events));
  }
}

export default function parseGlobalStyleSheet<T extends object>(
  styleSheet: GlobalStyleSheet,
  events: Events<T>,
) {
  parseFontFacesMap(styleSheet['@font-face'], events);
  parseImport(styleSheet['@import'], events);
  parseKeyframesMap(styleSheet['@keyframes'], events);
  parsePage(styleSheet['@page'], events);
  parseRoot(styleSheet['@root'], events);
  parseRootVariables(styleSheet['@variables'], events);
  parseViewport(styleSheet['@viewport'], events);
}
