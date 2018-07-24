/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import CSS from 'csstype';

/* eslint-disable no-use-before-define, max-len */

// TERMINOLOGY
// Style = The individual value for a property.
// Properties = An object of style properties.
// Declaration = Styles for a selector. Supports local at-rules.
// Selector = The name of an element.
// StyleSheet = An object of declarations. Supports global at-rules.

export type StyleName = string;

export type ThemeName = string;

export type ClassName = string;

// STYLES

export type AtRule =
  | '@charset'
  | '@font-face'
  | '@global'
  | '@import'
  | '@keyframes'
  | '@media'
  | '@namespace'
  | '@page'
  | '@supports'
  | '@viewport'
  | '@fallbacks';

export interface FontFace extends CSS.FontFace, CSS.FontFaceHyphen {}

export type Pseudos = { [P in CSS.SimplePseudos]?: Properties };

export interface Properties extends CSS.Properties, CSS.PropertiesHyphen {}

export interface PropertiesFallback extends CSS.PropertiesFallback, CSS.PropertiesHyphenFallback {}

export interface Declaration extends Properties, Pseudos {}

export interface StyleSheetMap<T> {
  [selector: string]: T;
}

export type StyleSheetDefinition<Theme, StyleSheet, Props = any> =
  | null
  | StyleSheet
  | UnifiedStyleSheet
  | ((theme: Theme, props: Props) => StyleSheet | UnifiedStyleSheet);

// UNIFIED SYNTAX

export interface UnifiedFontFace extends FontFace {
  local?: string[];
  srcPaths: string[];
}

export interface UnifiedKeyframes {
  [phase: string]: UnifiedDeclaration;
}

export interface UnifiedLocalAtRules {
  '@fallbacks'?: PropertiesFallback;
  '@media'?: { [mediaQuery: string]: Declaration };
  '@supports'?: { [featureQuery: string]: Declaration };
}

export interface UnifiedGlobalAtRules {
  '@charset'?: string;
  '@font-face'?: { [fontFamily: string]: UnifiedFontFace | UnifiedFontFace[] };
  '@global'?: { [selector: string]: UnifiedDeclaration };
  '@import'?: string | string[];
  '@keyframes'?: { [animationName: string]: UnifiedKeyframes };
  '@namespace'?: string;
  '@page'?: UnifiedDeclaration;
  '@viewport'?: UnifiedDeclaration;
}

export interface UnifiedDeclaration extends Declaration, UnifiedLocalAtRules {
  // Support attributes ([disabled]) and descendent selectors (> div)
  [property: string]: any;
}

export type UnifiedStyleSheet = UnifiedGlobalAtRules & {
  [selector: string]: UnifiedDeclaration;
};

// UNIFIED HANDLERS

export type Handler = (...args: any[]) => void;

export type CharsetHandler<T> = (styleSheet: T, charset: string) => void;

export type FallbacksHandler<D, P = any> = (declaration: D, values: P[], property: string) => void;

export type FontFaceHandler<T> = (
  styleSheet: T,
  fontFaces: FontFace[],
  fontFamily: string,
  srcPaths: string[][],
) => void;

export type GlobalHandler<T, D> = (styleSheet: T, declaration: D, selector: string) => void;

export type KeyframesHandler<T, D> = (styleSheet: T, declaration: D, animationName: string) => void;

export type ImportHandler<T> = (styleSheet: T, paths: string[]) => void;

export type MediaHandler<D> = (declaration: D, value: D, query: string) => void;

export type NamespaceHandler<T> = (styleSheet: T, namespace: string) => void;

export type PageHandler<T, D> = (styleSheet: T, declaration: D) => void;

export type PropertyHandler<D, P = any> = (declaration: D, value: P, property: string) => void;

export type SelectorHandler<D, P = any> = (declaration: D, value: P, selector: string) => void;

export type SupportsHandler<D> = (declaration: D, value: D, query: string) => void;

export type ViewportHandler<T, D> = (styleSheet: T, declaration: D) => void;
