import { isObject, toArray } from 'aesthetic-utils';
import Parser from './Parser';
import formatImport from './formatImport';
import { GlobalStyleSheet, PagePseudos } from './types';

export default class GlobalParser extends Parser {
  parse(styleSheet: GlobalStyleSheet) {
    this.parseCharset(styleSheet['@charset']);
    this.parseFontFaces(styleSheet['@font-face']);
    this.parseGlobal(styleSheet['@global']);
    this.parseImport(styleSheet['@import']);
    this.parseKeyframes(styleSheet['@keyframes']);
    this.parsePage(styleSheet['@page']);
    this.parseViewport(styleSheet['@viewport']);
  }

  protected parseCharset(charset: GlobalStyleSheet['@charset']) {
    if (!charset) {
      return;
    }

    if (__DEV__) {
      if (typeof charset !== 'string') {
        throw new TypeError('@charset must be a string.');
      }
    }

    this.emit('charset', charset);
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

    Object.entries(fontFaces).forEach(([name, faces]) => {
      toArray(faces).forEach(fontFace => {
        this.parseFontFace(name, fontFace);
      });
    });
  }

  protected parseGlobal(globals: GlobalStyleSheet['@global']) {
    if (!globals) {
      return;
    }

    // TODO
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

    imports.forEach(value => {
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

    Object.entries(keyframes).forEach(([name, keyframe]) => {
      this.parseKeyframe(name, keyframe);
    });
  }

  protected parsePage(page: GlobalStyleSheet['@page']) {
    if (!page) {
      return;
    }

    const object = { ...page };
    const pseudos: PagePseudos[] = [':blank', ':first', ':left', ':right'];

    // Parse each nested selector as its own page block
    pseudos.forEach(selector => {
      const value = object[selector];

      if (value) {
        this.emit('page', this.parseBlock(`@page ${selector}`, value));

        delete object[selector];
      }
    });

    // Then parse the root block itself
    if (Object.keys(object).length > 0) {
      this.emit('page', this.parseBlock('@page', object));
    }
  }

  protected parseViewport(viewport: GlobalStyleSheet['@viewport']) {
    if (viewport) {
      this.emit('viewport', this.parseBlock('@viewport', viewport));
    }
  }
}
