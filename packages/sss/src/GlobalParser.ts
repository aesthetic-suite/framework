import { isObject, toArray, objectLoop, arrayLoop } from '@aesthetic/utils';
import Parser, { CommonEvents } from './Parser';
import formatImport from './helpers/formatImport';
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
    this.parseFontFacesMap(styleSheet['@font-face']);
    this.parseGlobal(styleSheet['@global']);
    this.parseImport(styleSheet['@import']);
    this.parseKeyframesMap(styleSheet['@keyframes']);
    this.parsePage(styleSheet['@page']);
    this.parseRootVariables(styleSheet['@variables']);
    this.parseViewport(styleSheet['@viewport']);
  }

  protected parseFontFacesMap(fontFaces: GlobalStyleSheet['@font-face']) {
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
        this.parseFontFace(fontFace, name);
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

    arrayLoop(imports, (value) => {
      this.emit('import', formatImport(value));
    });
  }

  protected parseKeyframesMap(keyframes: GlobalStyleSheet['@keyframes']) {
    if (!keyframes) {
      return;
    }

    if (__DEV__) {
      if (!isObject(keyframes)) {
        throw new Error('@keyframes must be an object of animation names to keyframes.');
      }
    }

    objectLoop(keyframes, (keyframe, name) => {
      this.parseKeyframes(keyframe, name);
    });
  }

  protected parsePage(page: GlobalStyleSheet['@page']) {
    if (!page) {
      return;
    }

    this.validateDeclarationBlock(page, '@page');

    const object = { ...page };
    const pseudos: PagePseudos[] = [':blank', ':first', ':left', ':right'];

    // Parse each nested selector as its own page block
    pseudos.forEach((selector) => {
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

  protected parseRootVariables(variables: GlobalStyleSheet['@variables']) {
    if (variables) {
      this.parseVariables(null, variables);
    }
  }

  protected parseViewport(viewport: GlobalStyleSheet['@viewport']) {
    if (viewport) {
      this.emit('viewport', this.parseBlock(new Block('@viewport'), viewport));
    }
  }
}
