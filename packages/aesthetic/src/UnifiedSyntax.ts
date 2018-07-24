/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable no-param-reassign */

import formatFontFace from './unified/formatFontFace';
import isObject from './helpers/isObject';
import toArray from './helpers/toArray';
import {
  AtRule,
  Handler,
  FontFace,
  UnifiedStyleSheet,
  UnifiedDeclaration,
  CharsetHandler,
  NamespaceHandler,
  ImportHandler,
  FontFaceHandler,
  KeyframesHandler,
  GlobalHandler,
  PageHandler,
  ViewportHandler,
  SelectorHandler,
  PropertyHandler,
  FallbacksHandler,
  MediaHandler,
  SupportsHandler,
} from './types';

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

export const LOCAL_RULES: AtRule[] = ['@fallbacks', '@media', '@supports'];

export default class UnifiedSyntax<StyleSheet, Declaration> {
  events: { [eventName: string]: Handler } = {};

  fontFaces: { [fontFamily: string]: FontFace[] } = {};

  fontFacesCache: { [fontFamily: string]: string } = {};

  keyframes: { [animationName: string]: Declaration } = {};

  keyframesCache: { [animationName: string]: string } = {};

  constructor() {
    this.on('property', this.handleProperty)
      .on('selector', this.handleSelector)
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
   * Convert a mapping of style declarations to their native syntax.
   */
  convert(styleSheet: UnifiedStyleSheet): StyleSheet {
    const prevStyleSheet: UnifiedStyleSheet = { ...styleSheet };
    const nextStyleSheet: any = {};

    // Extract global at-rules first
    // eslint-disable-next-line complexity
    GLOBAL_RULES.forEach(rule => {
      if (!prevStyleSheet[rule]) {
        delete prevStyleSheet[rule];

        return;
      }

      switch (rule) {
        case '@charset':
        case '@namespace': {
          const path = prevStyleSheet[rule];

          if (typeof path === 'string') {
            this.emit(rule, [nextStyleSheet, path]);
          } else if (process.env.NODE_ENV !== 'production') {
            throw new Error(`${rule} value must be a string.`);
          }

          break;
        }

        case '@import': {
          const paths = prevStyleSheet[rule];

          if (typeof paths === 'string' || Array.isArray(paths)) {
            this.emit(rule, [nextStyleSheet, toArray(paths)]);
          } else if (process.env.NODE_ENV !== 'production') {
            throw new Error(`${rule} value must be a string, or an array of strings.`);
          }

          break;
        }

        case '@font-face': {
          const faces = prevStyleSheet[rule];

          if (!faces) {
            return;
          }

          Object.keys(faces).forEach(fontFamily => {
            const srcPaths: string[][] = [];

            this.fontFaces[fontFamily] = toArray(faces[fontFamily]).map(font => {
              srcPaths.push(font.srcPaths);

              return formatFontFace({
                ...font,
                fontFamily,
              });
            });

            this.emit(rule, [nextStyleSheet, this.fontFaces[fontFamily], fontFamily, srcPaths]);
          });

          break;
        }

        case '@global': {
          const globals = prevStyleSheet[rule];

          if (!globals) {
            return;
          }

          Object.keys(globals).forEach(selector => {
            if (isObject(globals[selector])) {
              this.emit(rule, [
                nextStyleSheet,
                this.convertDeclaration(selector, globals[selector]),
                selector,
              ]);
            } else if (process.env.NODE_ENV !== 'production') {
              throw new Error('Invalid @global selector style declaration.');
            }
          });

          break;
        }

        case '@keyframes': {
          const frames = prevStyleSheet[rule];

          if (!frames) {
            return;
          }

          Object.keys(frames).forEach(animationName => {
            this.keyframes[animationName] = this.convertDeclaration(
              animationName,
              frames[animationName],
            );

            this.emit(rule, [nextStyleSheet, this.keyframes[animationName], animationName]);
          });

          break;
        }

        case '@page':
        case '@viewport': {
          const style = prevStyleSheet[rule];

          if (isObject(style)) {
            this.emit(rule, [nextStyleSheet, this.convertDeclaration(rule, style)]);
          } else if (process.env.NODE_ENV !== 'production') {
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
    Object.keys(prevStyleSheet).forEach(selector => {
      const declaration = prevStyleSheet[selector];

      if (!declaration) {
        return;
      }

      // At-rule
      if (selector.charAt(0) === '@') {
        if (process.env.NODE_ENV !== 'production') {
          throw new SyntaxError(`Unsupported global at-rule "${selector}".`);
        }

        // Class name
      } else if (typeof declaration === 'string') {
        nextStyleSheet[selector] = declaration;

        // Style object
      } else if (isObject(declaration)) {
        nextStyleSheet[selector] = this.convertDeclaration(selector, declaration);

        // Unknown
      } else if (process.env.NODE_ENV !== 'production') {
        throw new Error(`Invalid style declaration for "${selector}".`);
      }
    });

    return nextStyleSheet;
  }

  /**
   * Convert a style declaration including local at-rules and properties.
   */
  convertDeclaration(selector: string, declaration: UnifiedDeclaration): Declaration {
    const prevDeclaration: UnifiedDeclaration = { ...declaration };
    const nextDeclaration = {};

    // Convert properties first
    Object.keys(prevDeclaration).forEach(key => {
      switch (key.charAt(0)) {
        case '@':
          return;

        case ':':
        case '>':
        case '[': {
          // Support comma separated selectors
          key.split(',').forEach(k => {
            this.emit('selector', [nextDeclaration, prevDeclaration[key], k.trim()]);
          });

          break;
        }

        default:
          this.emit('property', [nextDeclaration, prevDeclaration[key], key]);
          break;
      }

      delete prevDeclaration[key];
    });

    // Extract local at-rules first
    LOCAL_RULES.forEach(rule => {
      const style = prevDeclaration[rule];

      delete prevDeclaration[rule];

      if (!style || !isObject(style)) {
        return;
      }

      switch (rule) {
        case '@fallbacks':
          const fallbacks = prevDeclaration[rule] || {};

          Object.keys(fallbacks).forEach(property => {
            this.emit(rule, [nextDeclaration, toArray((fallbacks as any)[property]), property]);
          });
          break;

        case '@media':
        case '@supports':
          const styles = prevDeclaration[rule] || {};

          Object.keys(styles).forEach(condition => {
            if (isObject(styles[condition])) {
              this.emit(rule, [nextDeclaration, styles[condition], condition]);
            } else if (process.env.NODE_ENV !== 'production') {
              throw new Error(
                `${rule} ${condition} must be a mapping of conditions to style objects.`,
              );
            }
          });
          break;

        default:
          return;
      }
    });

    // Error for unknown at-rules
    if (process.env.NODE_ENV !== 'production') {
      Object.keys(prevDeclaration).forEach(key => {
        throw new SyntaxError(`Unsupported local at-rule "${key}".`);
      });
    }

    return nextDeclaration as Declaration;
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
  emit(eventName: string, args: any[]): this {
    if (this.events[eventName]) {
      this.events[eventName](...args);
    }

    return this;
  }

  /**
   * Handle @charset.
   */
  handleCharset(styleSheet: any, charset: string) {
    styleSheet['@charset'] = `"${charset}"`;
  }

  /**
   * Handle fallback properties.
   */
  handleFallbacks(declaration: any, fallbacks: any[], property: string) {
    declaration[property] = [declaration[property], ...fallbacks].filter(Boolean);
  }

  /**
   * Handle @font-face.
   */
  handleFontFace(styleSheet: any, fontFaces: FontFace[], fontFamily: string, srcPaths: string[][]) {
    const prevValue = styleSheet['@font-face'];

    styleSheet['@font-face'] = [
      ...(Array.isArray(prevValue) ? prevValue : [prevValue]),
      ...fontFaces,
    ];
  }

  /**
   * Handle global styles (like body, html, etc).
   */
  handleGlobal(styleSheet: any, declaration: any, selector: string) {
    // Do nothing
  }

  /**
   * Handle @namespace.
   */
  handleImport(styleSheet: any, paths: string[]) {
    styleSheet['@import'] = paths;
  }

  /**
   * Handle @keyframes.
   */
  handleKeyframes(styleSheet: any, declaration: any, animationName: string) {
    styleSheet[`@keyframes ${animationName}`] = declaration;
  }

  /**
   * Handle @media.
   */
  handleMedia(declaration: any, style: any, query: string) {
    declaration[`@media ${query}`] = style;
  }

  /**
   * Handle @namespace.
   */
  handleNamespace(styleSheet: any, namespace: string) {
    styleSheet['@namespace'] = namespace;
  }

  /**
   * Handle @page.
   */
  handlePage(styleSheet: any, declaration: any) {
    styleSheet['@page'] = declaration;
  }

  /**
   * Handle CSS properties.
   */
  handleProperty(declaration: any, value: any, property: string) {
    declaration[property] = value;
  }

  /**
   * Handle selector styles.
   */
  handleSelector(declaration: any, value: any, selector: string) {
    declaration[selector] = value;
  }

  /**
   * Handle @supports.
   */
  handleSupports(declaration: any, style: any, query: string) {
    declaration[`@supports ${query}`] = style;
  }

  /**
   * Handle @viewport.
   */
  handleViewport(styleSheet: any, declaration: any) {
    styleSheet['@viewport'] = declaration;
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
  on(eventName: '@charset', callback: CharsetHandler<StyleSheet>): this;
  on(eventName: '@fallbacks', callback: FallbacksHandler<Declaration>): this;
  on(eventName: '@font-face', callback: FontFaceHandler<StyleSheet>): this;
  on(eventName: '@global', callback: GlobalHandler<StyleSheet, Declaration>): this;
  on(eventName: '@import', callback: ImportHandler<StyleSheet>): this;
  on(eventName: '@keyframes', callback: KeyframesHandler<StyleSheet, Declaration>): this;
  on(eventName: '@media', callback: MediaHandler<Declaration>): this;
  on(eventName: '@namespace', callback: NamespaceHandler<StyleSheet>): this;
  on(eventName: '@page', callback: PageHandler<StyleSheet, Declaration>): this;
  on(eventName: '@supports', callback: SupportsHandler<Declaration>): this;
  on(eventName: '@viewport', callback: ViewportHandler<StyleSheet, Declaration>): this;
  on(eventName: 'property', callback: PropertyHandler<Declaration>): this;
  on(eventName: 'selector', callback: SelectorHandler<Declaration>): this;
  on(eventName: string, callback: Handler): this {
    this.events[eventName] = callback;

    return this;
  }
}
