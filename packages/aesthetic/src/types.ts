/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import CSS from 'csstype';

/* eslint-disable no-use-before-define, max-len */

export type $FixMe = any;

// TERMINOLOGY
// Style = The individual value for a property.
// Properties = An object of style properties.
// Declaration = Styles for a selector. Supports local at-rules.
// Selector = The name of an element.
// StyleSheet = An object of declarations. Supports global at-rules.

export interface HOCOptions {
  extendable?: boolean;
  extendFrom?: string;
  passThemeNameProp?: boolean;
  passThemeProp?: boolean;
  pure?: boolean;
  styleName?: string;
  stylesPropName?: string;
  themePropName?: string;
}

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

export interface Pseudos {
  [P in CSS.Pseudos]?: Properties;
}

export interface Properties extends CSS.Properties, CSS.PropertiesHyphen {}

export interface PropertiesFallback extends CSS.PropertiesFallback, CSS.PropertiesHyphenFallback {}

export interface Declaration extends Properties, Pseudos {
  // Support attributes ([disabled]) and descendent selectors (> div)
  [property: string]: any;
}

export interface GlobalAtRules<T> {
  '@charset'?: string;
  '@font-face'?: FontFace[];
  '@import'?: string[];
  '@namespace'?: string;
  '@page'?: T;
  '@viewport'?: T;
}

export type StyleSheet<T> = GlobalAtRules<T> & {
  [selector: string]: T;
};

// THEMES

export type ThemeName = string;

export type ThemeSheet = any;

// UNIFIED SYNTAX

export interface UnifiedDeclaration extends Declaration, UnifiedLocalAtRules {}

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

export type UnifiedStyleSheet = UnifiedGlobalAtRules & {
  [selector: string]: UnifiedDeclaration;
};

// UNIFIED HANDLERS

export type Handler = (...args: any[]) => void;

export type CharsetHandler = (styleSheet: StyleSheet, charset: string) => void;

export type FontFaceHandler = (
  styleSheet: StyleSheet,
  fontFaces: UnifiedFontFace[],
  fontFamily: string,
) => void;

export type GlobalHandler = (
  styleSheet: StyleSheet,
  declaration: UnifiedDeclaration,
  animationName: string,
) => void;

export type KeyframesHandler = (
  styleSheet: StyleSheet,
  declaration: UnifiedDeclaration,
  animationName: string,
) => void;

export type ImportHandler = (styleSheet: StyleSheet, paths: string[]) => void;

export type NamespaceHandler = (styleSheet: StyleSheet, namespace: string) => void;

export type PageHandler = (styleSheet: StyleSheet, declaration: UnifiedDeclaration) => void;

export type ViewportHandler = (
  styleSheet: UnifiedStyleSheet,
  declaration: UnifiedDeclaration,
) => void;
