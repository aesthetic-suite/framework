/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import isObject from './helpers/isObject';
import toArray from './helpers/toArray';

import type {
  AtRule,
  EventCallback,
  Statement,
  StatementUnified,
  Style,
  StyleBlock,
  StyleDeclaration,
  StyleDeclarationUnified,
} from '../../types';

export const GLOBAL_RULES: AtRule[] = [
  '@charset',
  '@document',
  '@font-face',
  '@import',
  '@keyframes',
  '@namespace',
  '@page',
  '@viewport',
];

export const LOCAL_RULES: AtRule[] = ['@fallbacks', '@media', '@supports'];

export default class UnifiedSyntax {
  events: { [eventName: string]: EventCallback } = {};

  fontFaces: { [fontFamily: string]: StyleBlock[] } = {};

  keyframes: { [animationName: string]: StyleBlock } = {};

  /**
   * Convert a mapping of style declarations to their native syntax.
   */
  convert(statement: StatementUnified): Statement {
    const nextStatement = {};

    // eslint-disable-next-line complexity
    Object.keys(statement).forEach((selector) => {
      switch (selector) {
        case '@charset':
        case '@import':
        case '@namespace': {
          const path = statement[selector];

          if (typeof path === 'string') {
            this.emit(selector, [nextStatement, path]);
          } else if (__DEV__) {
            throw new Error(`${selector} value must be a string.`);
          }

          break;
        }

        case '@document': {
          const doc = statement['@document'];

          Object.keys(doc).forEach((url) => {
            if (isObject(doc[url])) {
              this.emit(selector, [nextStatement, doc[url], url]);
            } else if (__DEV__) {
              throw new Error(`${selector} must be a mapping of URLs to style objects.`);
            }
          });

          break;
        }

        case '@font-face': {
          const faces = statement['@font-face'];

          Object.keys(faces).forEach((fontFamily) => {
            const fontFaces = toArray(faces[fontFamily]).map(font => ({
              ...font,
              fontFamily,
            }));

            this.emit(selector, [nextStatement, fontFaces, fontFamily]);

            this.fontFaces[fontFamily] = fontFaces;
          });

          break;
        }

        case '@keyframes': {
          const frames = statement['@keyframes'];

          Object.keys(frames).forEach((animationName) => {
            const keyframes = frames[animationName];

            if (isObject(keyframes)) {
              this.emit(selector, [nextStatement, keyframes, animationName]);
            } else if (__DEV__) {
              throw new Error(`${selector} must be a mapping of animation names to style objects.`);
            }

            // $FlowIgnore TODO
            this.keyframes[animationName] = keyframes;
          });

          break;
        }

        case '@page':
        case '@viewport': {
          const style = statement[selector];

          if (isObject(style)) {
            this.emit(selector, [nextStatement, style]);
          } else if (__DEV__) {
            throw new Error(`${selector} must be a style object.`);
          }

          break;
        }

        default: {
          const declaration = statement[selector];

          // At-rule
          if (selector.charAt(0) === '@') {
            if (__DEV__) {
              throw new SyntaxError(`Unsupported global at-rule "${selector}".`);
            }

          // Class name
          } else if (typeof declaration === 'string') {
            nextStatement[selector] = declaration;

          // Style object
          } else if (isObject(declaration)) {
            nextStatement[selector] = this.convertDeclaration(selector, declaration);

          } else if (__DEV__) {
            throw new Error(`Invalid style declaration for "${selector}".`);
          }

          break;
        }
      }
    });

    return nextStatement;
  }

  /**
   * Convert a style declaration including local at-rules and properties.
   */
  convertDeclaration(selector: string, declaration: StyleDeclarationUnified): StyleDeclaration {
    const nextDeclaration = {};

    Object.keys(declaration).forEach((key) => {
      switch (key) {
        case '@fallbacks': {
          const fallbacks = declaration['@fallbacks'];

          Object.keys(fallbacks).forEach((property) => {
            this.emit(key, [
              nextDeclaration,
              toArray(fallbacks[property]),
              property,
            ]);
          });

          break;
        }

        case '@media':
        case '@supports': {
          const style = declaration[key];

          Object.keys(style).forEach((condition) => {
            if (isObject(style[condition])) {
              this.emit(selector, [nextDeclaration, style[condition], condition]);
            } else if (__DEV__) {
              throw new Error(`${selector} must be a mapping of conditions to style objects.`);
            }
          });

          break;
        }

        default: {
          if (key.charAt(0) === '@') {
            if (__DEV__) {
              throw new SyntaxError(`Unsupported local at-rule "${key}".`);
            }
          } else {
            this.emit('property', [nextDeclaration, declaration[key], key]);
          }

          break;
        }
      }
    });

    return nextDeclaration;
  }

  /**
   * Execute the defined event listener with the arguments.
   */
  emit(eventName: string, args: *[] = []): this {
    if (this.events[eventName]) {
      this.events[eventName](...args);
    }

    return this;
  }

  /**
   * Handle @charset.
   */
  handleCharset(statement: Statement, style: string) {
    statement['@charset'] = style;
  }

  /**
   * Handle @document.
   */
  handleDocument(statement: Statement, style: StyleBlock, url: string) {
    statement[`@document ${url}`] = style;
  }

  /**
   * Handle fallback properties.
   */
  handleFallbacks(declaration: StyleDeclaration, style: Style[], property: string) {
    const value = declaration[property];

    if (typeof value === 'undefined') {
      return;
    }

    declaration[property] = [...style, value];
  }

  /**
   * Handle @font-face.
   */
  handleFontFace(statement: Statement, style: StyleBlock[], fontFamily: string) {
    statement['@font-face'] = style;
  }

  /**
   * Handle @namespace.
   */
  handleImport(statement: Statement, style: string) {
    statement['@namespace'] = style;
  }

  /**
   * Handle @keyframes.
   */
  handleKeyframes(statement: Statement, style: StyleBlock, animationName: string) {
    statement[`@keyframes ${animationName}`] = style;
  }

  /**
   * Handle @media.
   */
  handleMedia(declaration: StyleDeclaration, style: StyleBlock, condition: string) {
    declaration[`@media ${condition}`] = style;
  }

  /**
   * Handle @namespace.
   */
  handleNamespace(statement: Statement, style: string) {
    statement['@namespace'] = style;
  }

  /**
   * Handle @page.
   */
  handlePage(statement: Statement, style: StyleBlock) {
    statement['@page'] = style;
  }

  /**
   * Handle CSS properties.
   */
  handleProperty(declaration: StyleDeclaration, style: Style, property: string) {
    let value = style;

    if (property === 'animationName') {
      value = this.injectKeyframes(style);

    } else if (property === 'fontFamily') {
      value = this.injectFontFaces(style);
    }

    // $FlowIgnore TODO
    declaration[property] = value;
  }

  /**
   * Handle @supports.
   */
  handleSupports(declaration: StyleDeclaration, style: StyleBlock, condition: string) {
    declaration[`@supports ${condition}`] = style;
  }

  /**
   * Handle @viewport.
   */
  handleViewport(statement: Statement, style: StyleBlock) {
    statement['@viewport'] = style;
  }

  /**
   * Replace a `fontFamily` property with font face objects of the same name.
   */
  injectFontFaces(value: Style): (string | StyleBlock)[] {
    const cache = this.fontFaces;
    const fontFaces = [];

    String(value).split(',').forEach((name) => {
      const familyName = name.trim();
      const fonts = cache[familyName];

      if (Array.isArray(fonts)) {
        fontFaces.push(...fonts);
      } else {
        fontFaces.push(familyName);
      }
    });

    return fontFaces;
  }

  /**
   * Replace a `animationName` property with keyframe objects of the same name.
   */
  injectKeyframes(value: Style): (string | StyleBlock)[] {
    const cache = this.keyframes;

    return String(value).split(',').map((name) => {
      const animationName = name.trim();

      return cache[animationName] || animationName;
    });
  }

  /**
   * Delete an event listener.
   */
  off(eventName: string): this {
    delete this.events[eventName];

    return this;
  }

  /**
   * Register an event listener.
   */
  on(eventName: string, callback: EventCallback): this {
    this.events[eventName] = callback;

    return this;
  }
}
