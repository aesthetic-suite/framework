/* eslint-disable import/no-unresolved, @typescript-eslint/no-explicit-any */

import CSS from 'csstype';
import Adapter from './Adapter';

// NEVERIZE
// https://github.com/Microsoft/TypeScript/issues/29390

// TERMINOLOGY
// https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax
// Declaration - The property and value pair.
// Block - A mapping of multiple declarations.
// Selector - The name of an element(s).
// Ruleset - The selector and block pair.
// StyleSheet = A mapping of multiple rulesets by selector.

export type StyleName = string;

export type ThemeName = string;

export type ClassName = string;

export type RawCss = string;

export type Direction = 'neutral' | 'ltr' | 'rtl';

export type ExpandCompoundProperty<B, T> = B | T | (B | T)[];

export type CompoundProperties = 'animationName' | 'fontFamily';

export interface SheetMap<T> {
  [selector: string]: T;
}

// SYNTAX

export type AtRule =
  | '@charset'
  | '@font-face'
  | '@global'
  | '@import'
  | '@keyframes'
  | '@media'
  | '@page'
  | '@selectors'
  | '@supports'
  | '@viewport'
  | '@fallbacks';

export type Properties = Omit<CSS.Properties<string | number>, CompoundProperties> & {
  animationName?: ExpandCompoundProperty<CSS.AnimationNameProperty, Keyframes>;
  fontFamily?: ExpandCompoundProperty<CSS.FontFamilyProperty, FontFace>;
};

export type PropertiesFallback = CSS.PropertiesFallback<string | number>;

export type Pseudos = { [P in CSS.SimplePseudos]?: Block };

export type Attributes = { [A in CSS.HtmlAttributes]?: Block };

export type Block = Properties & Pseudos & Attributes;

export type StyleBlock = Block; // Alias for consumers

export type FontFace = CSS.FontFace & {
  local?: string[];
  srcPaths: string[];
};

export interface Keyframes {
  [percent: string]: Block | string | undefined;
  from?: Block;
  to?: Block;
  name?: string;
}

// COMPONENT STYLE SHEET

export type ComponentBlock = Block & {
  '@fallbacks'?: PropertiesFallback;
  '@media'?: { [mediaQuery: string]: Block };
  '@selectors'?: { [selector: string]: Block };
  '@supports'?: { [featureQuery: string]: Block };
};

export type ComponentBlockNeverize<T> = T extends string
  ? string
  : {
      [K in keyof T]: K extends keyof ComponentBlock ? ComponentBlock[K] : never;
    };

export type StyleSheet = SheetMap<ClassName | RawCss | ComponentBlock>;

export type StyleSheetNeverize<T> = {
  [K in keyof T]: ComponentBlockNeverize<T[K]>;
};

export type StyleSheetFactory<Theme = ThemeSheet, T = unknown> = (
  theme: Theme,
) => T extends unknown ? StyleSheet : StyleSheet & StyleSheetNeverize<T>;

// GLOBAL STYLE SHEET

export interface GlobalSheet {
  '@charset'?: string;
  '@font-face'?: { [fontFamily: string]: FontFace | FontFace[] };
  '@global'?: { [selector: string]: Block };
  '@import'?: string | string[];
  '@keyframes'?: { [animationName: string]: Keyframes };
  '@page'?: Block;
  '@viewport'?: Block;
}

export type GlobalSheetNeverize<T> = {
  [K in keyof T]: K extends keyof GlobalSheet ? GlobalSheet[K] : never;
};

export type GlobalSheetFactory<Theme = ThemeSheet, T = unknown> = (
  theme: Theme,
) => T extends unknown ? GlobalSheet : GlobalSheet & GlobalSheetNeverize<T>;

// THEMES

export interface ThemeSheet {
  [key: string]: any;
}

// CLASSES

export type ClassNameTransformer = (
  ...styles: (undefined | false | ClassName | object | Block)[]
) => ClassName;

// ADAPTERS

export type CompiledStyleSheet = SheetMap<ClassName | object>;

// MISC

export interface AestheticOptions {
  adapter: Adapter<any, any>;
  cxPropName: string;
  extendable: boolean;
  passThemeProp: boolean;
  rtl: boolean;
  stylesPropName: string;
  theme: ThemeName;
  themePropName: string;
}

export interface TransformOptions {
  dir?: Direction;
  global?: boolean;
  name?: StyleName;
  theme?: ThemeName;
}
