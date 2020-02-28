import { isObject, toArray, objectLoop, arrayLoop } from '@aesthetic/utils';
import Parser, { CommonEvents } from './Parser';
import formatImport from './formatImport';
import { GlobalStyleSheet, PagePseudos, BlockListener, ImportListener } from './types';
import Block from './Block';

export interface GlobalEvents<T extends object> extends CommonEvents<T> {
  onGlobal?: BlockListener<T>;
  onImport?: ImportListener;
  onPage?: BlockListener<T>;
  onViewport?: BlockListener<T>;
}

export default class GlobalParser<T extends object> extends Parser<T, GlobalEvents<T>> {
  parse(styleSheet: GlobalStyleSheet) {
    this.parseFontFaces(styleSheet['@font-face']);
    this.parseGlobal(styleSheet['@global']);
    this.parseImport(styleSheet['@import']);
    this.parseKeyframes(styleSheet['@keyframes']);
    this.parsePage(styleSheet['@page']);
    this.parseViewport(styleSheet['@viewport']);
  }

  protected parseFontFaces(fontFaces: GlobalStyleSheet['@font-face']) {
    if (!fontFaces) {
      return;
    }

    if (__DEV__) {
      if (!isObject(fontFaces)) {
        throw new Error('@font-face must be an object of font family names to font faces.');
      }
    }

    objectLoop(fontFaces, (faces, name) => {
      arrayLoop(toArray(faces), fontFace => {
        this.parseFontFace(name, fontFace);
      });
    });
  }

  protected parseGlobal(globals: GlobalStyleSheet['@global']) {
    if (globals) {
      this.emit('global', this.parseLocalBlock(new Block('@global'), globals));
    }
  }

  protected parseImport(imports: GlobalStyleSheet['@import']) {
    if (!imports) {
      return;
    }

    if (__DEV__) {
      if (!Array.isArray(imports)) {
        throw new TypeError('@import must be an array of strings or import objects.');
      }
    }

    arrayLoop(imports, value => {
      this.emit('import', formatImport(value));
    });
  }

  protected parseKeyframes(keyframes: GlobalStyleSheet['@keyframes']) {
    if (!keyframes) {
      return;
    }

    if (__DEV__) {
      if (!isObject(keyframes)) {
        throw new Error('@keyframes must be an object of animation names to keyframes.');
      }
    }

    objectLoop(keyframes, (keyframe, name) => {
      this.parseKeyframesAnimation(name, keyframe);
    });
  }

  protected parsePage(page: GlobalStyleSheet['@page']) {
    if (!page) {
      return;
    }

    if (__DEV__) {
      if (!isObject(page)) {
        throw new Error('@page must be an object of properties.');
      }
    }

    const object = { ...page };
    const pseudos: PagePseudos[] = [':blank', ':first', ':left', ':right'];

    // Parse each nested selector as its own page block
    pseudos.forEach(selector => {
      const value = object[selector];

      if (value) {
        this.emit('page', this.parseBlock(new Block(`@page ${selector}`), value));

        delete object[selector];
      }
    });

    // Then parse the root block itself
    if (Object.keys(object).length > 0) {
      this.emit('page', this.parseBlock(new Block('@page'), object));
    }
  }

  protected parseViewport(viewport: GlobalStyleSheet['@viewport']) {
    if (viewport) {
      this.emit('viewport', this.parseBlock(new Block('@viewport'), viewport));
    }
  }
}
