/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import formatFontFace from './helpers/formatFontFace';
import isObject from './helpers/isObject';
import toArray from './helpers/toArray';

import type {
  AtRule,
  EventCallback,
  Style,
  StyleBlock,
  StyleDeclaration,
  StyleSheet,
} from '../../types';

export const GLOBAL_RULES: AtRule[] = [
  '@charset',
  '@font-face',
  '@global',
  '@import',
  '@keyframes',
  '@namespace',
  '@page',
  '@viewport',
];

export const LOCAL_RULES: AtRule[] = [
  '@fallbacks',
  '@media',
  '@supports',
];

export default class UnifiedSyntax {
  events: { [eventName: string]: EventCallback } = {};

  fontFaces: { [fontFamily: string]: StyleBlock[] } = {};

  fontFacesCache: { [fontFamily: string]: string } = {};

  keyframes: { [animationName: string]: StyleBlock } = {};

  keyframesCache: { [animationName: string]: string } = {};

  constructor() {
    this
      .on('property', this.handleProperty)
      .on('@charset', this.handleCharset)
      .on('@fallbacks', this.handleFallbacks)
      .on('@font-face', this.handleFontFace)
      .on('@global', this.handleGlobal)
      .on('@import', this.handleImport)
      .on('@keyframes', this.handleKeyframes)
      .on('@media', this.handleMedia)
      .on('@namespace', this.handleNamespace)
      .on('@page', this.handlePage)
      .on('@supports', this.handleSupports)
      .on('@viewport', this.handleViewport);
  }

  /**
   * Check that a value is a style declaration block.
   */
  checkBlock(value: *): Object {
    if (isObject(value)) {
      return value;
    }

    throw new Error('Must be a style declaration.');
  }

  /**
   * Convert a mapping of style declarations to their native syntax.
   */
  convert(styleSheet: StyleSheet): StyleSheet {
    const prevStyleSheet = { ...styleSheet };
    const nextStyleSheet = {};

    // Extract global at-rules first
    // eslint-disable-next-line complexity
    GLOBAL_RULES.forEach((rule) => {
      if (!prevStyleSheet[rule]) {
        delete prevStyleSheet[rule];

        return;
      }

      switch (rule) {
        case '@charset':
        case '@import':
        case '@namespace': {
          const path = prevStyleSheet[rule];

          if (typeof path === 'string') {
            this.emit(rule, [nextStyleSheet, path]);
          } else if (__DEV__) {
            throw new Error(`${rule} value must be a string.`);
          }

          break;
        }

        case '@font-face': {
          const faces = prevStyleSheet['@font-face'];

          Object.keys(this.checkBlock(faces)).forEach((fontFamily) => {
            // $FlowIgnore
            this.fontFaces[fontFamily] = toArray(faces[fontFamily])
              .map(font => ({
                ...font,
                fontFamily,
              }));

            this.emit(rule, [nextStyleSheet, this.fontFaces[fontFamily], fontFamily]);
          });

          break;
        }

        case '@global': {
          const globals = prevStyleSheet['@global'];

          Object.keys(this.checkBlock(globals)).forEach((selector) => {
            if (isObject(globals[selector])) {
              this.emit(rule, [
                nextStyleSheet,
                this.convertDeclaration(selector, globals[selector]),
                selector,
              ]);
            } else if (__DEV__) {
              throw new Error('Invalid @global selector style declaration.');
            }
          });

          break;
        }

        case '@keyframes': {
          const frames = prevStyleSheet['@keyframes'];

          Object.keys(this.checkBlock(frames)).forEach((animationName) => {
            this.keyframes[animationName] = this.checkBlock(frames[animationName]);

            this.emit(rule, [nextStyleSheet, this.keyframes[animationName], animationName]);
          });

          break;
        }

        case '@page':
        case '@viewport': {
          const style = prevStyleSheet[rule];

          if (isObject(style)) {
            this.emit(rule, [nextStyleSheet, style]);
          } else if (__DEV__) {
            throw new Error(`${rule} must be a style object.`);
          }

          break;
        }

        /* istanbul ignore next */
        default:
          break;
      }

      delete prevStyleSheet[rule];
    });

    // Convert declarations last
    Object.keys(prevStyleSheet).forEach((selector) => {
      const declaration = prevStyleSheet[selector];

      delete prevStyleSheet[selector];

      if (!declaration) {
        return;
      }

      // At-rule
      if (selector.charAt(0) === '@') {
        if (__DEV__) {
          throw new SyntaxError(`Unsupported global at-rule "${selector}".`);
        }

      // Class name
      } else if (typeof declaration === 'string') {
        nextStyleSheet[selector] = declaration;

      // Style object
      } else if (isObject(declaration)) {
        nextStyleSheet[selector] = this.convertDeclaration(selector, declaration);

      } else if (__DEV__) {
        throw new Error(`Invalid style declaration for "${selector}".`);
      }
    });

    return nextStyleSheet;
  }

  /**
   * Convert a style declaration including local at-rules and properties.
   */
  convertDeclaration(selector: string, declaration: StyleDeclaration): StyleDeclaration {
    const prevDeclaration = { ...declaration };
    const nextDeclaration = {};

    // Convert properties first
    Object.keys(prevDeclaration).forEach((key) => {
      if (key.charAt(0) !== '@') {
        this.emit('property', [nextDeclaration, prevDeclaration[key], key]);

        delete prevDeclaration[key];
      }
    });

    // Extract local at-rules first
    LOCAL_RULES.forEach((rule) => {
      const style = prevDeclaration[rule];

      delete prevDeclaration[rule];

      if (!style || !isObject(style)) {
        return;
      }

      if (rule === '@fallbacks') {
        Object.keys(style).forEach((property) => {
          this.emit(rule, [nextDeclaration, toArray(style[property]), property]);
        });

      } else if (rule === '@media' || rule === '@supports') {
        Object.keys(style).forEach((condition) => {
          if (isObject(style[condition])) {
            this.emit(rule, [nextDeclaration, style[condition], condition]);
          } else if (__DEV__) {
            throw new Error(`${rule} ${condition} must be a mapping of conditions to style objects.`);
          }
        });
      }
    });

    // Error for unknown at-rules
    if (__DEV__) {
      Object.keys(prevDeclaration).forEach((key) => {
        throw new SyntaxError(`Unsupported local at-rule "${key}".`);
      });
    }

    return nextDeclaration;
  }

  /**
   * Create a noop function that throws an error for unsupported features.
   */
  createUnsupportedHandler(rule: AtRule): () => void {
    return () => {
      throw new Error(`Adapter does not support "${rule}".`);
    };
  }

  /**
   * Execute the defined event listener with the arguments.
   */
  emit(eventName: string, args: *[]): this {
    if (this.events[eventName]) {
      this.events[eventName](...args);
    }

    return this;
  }

  /**
   * Handle @charset.
   */
  handleCharset(styleSheet: StyleSheet, style: string) {
    styleSheet['@charset'] = style;
  }

  /**
   * Handle fallback properties.
   */
  handleFallbacks(declaration: StyleDeclaration, style: Style[], property: string) {
    declaration[property] = [declaration[property], ...style].filter(Boolean);
  }

  /**
   * Handle @font-face.
   */
  handleFontFace(styleSheet: StyleSheet, style: StyleBlock[], fontFamily: string) {
    if (Array.isArray(styleSheet['@font-face'])) {
      styleSheet['@font-face'].push(...style);
    } else {
      styleSheet['@font-face'] = style;
    }
  }

  /**
   * Handle global styles (like body, html, etc).
   */
  handleGlobal(styleSheet: StyleSheet, declaration: StyleDeclaration, selector: string) {
    // Do nothing
  }

  /**
   * Handle @namespace.
   */
  handleImport(styleSheet: StyleSheet, style: string) {
    styleSheet['@import'] = style;
  }

  /**
   * Handle @keyframes.
   */
  handleKeyframes(styleSheet: StyleSheet, style: StyleBlock, animationName: string) {
    styleSheet[`@keyframes ${animationName}`] = style;
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
  handleNamespace(styleSheet: StyleSheet, style: string) {
    styleSheet['@namespace'] = style;
  }

  /**
   * Handle @page.
   */
  handlePage(styleSheet: StyleSheet, style: StyleBlock) {
    styleSheet['@page'] = style;
  }

  /**
   * Handle CSS properties.
   */
  handleProperty = (declaration: StyleDeclaration, style: Style, property: string) => {
    declaration[property] = style;
  };

  /**
   * Handle @supports.
   */
  handleSupports(declaration: StyleDeclaration, style: StyleBlock, condition: string) {
    declaration[`@supports ${condition}`] = style;
  }

  /**
   * Handle @viewport.
   */
  handleViewport(styleSheet: StyleSheet, style: StyleBlock) {
    styleSheet['@viewport'] = style;
  }

  /**
   * Replace a `fontFamily` property with font face objects of the same name.
   */
  injectFontFaces(value: Style, cache: Object): Style[] {
    const fontFaces = [];

    String(value).split(',').forEach((name) => {
      const familyName = name.trim();
      const fonts = cache[familyName];

      if (Array.isArray(fonts)) {
        fonts.forEach((font) => {
          fontFaces.push(formatFontFace(font));
        });
      } else {
        fontFaces.push(familyName);
      }
    });

    return fontFaces;
  }

  /**
   * Replace a `animationName` property with keyframe objects of the same name.
   */
  injectKeyframes(value: Style, cache: Object): Style[] {
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
