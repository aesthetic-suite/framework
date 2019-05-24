/* eslint-disable import/no-unresolved, @typescript-eslint/prefer-interface */

import CSS from 'csstype';
import { Omit } from 'utility-types';

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

export type ClassNameGenerator<N extends object, P extends object | string> = (
  ...styles: (undefined | false | ClassName | N | P)[]
) => ClassName;

export type RawCss = string;

export type ExtendedProperty<B, T> = B | T | (B | T)[];

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

export type Properties = Omit<CSS.Properties<string | number>, 'animationName' | 'fontFamily'> & {
  animationName?: ExtendedProperty<CSS.AnimationNameProperty, Keyframes>;
  fontFamily?: ExtendedProperty<CSS.FontFamilyProperty, FontFace>;
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

export type Keyframes = {
  from?: Block;
  to?: Block;
  name?: string;
  [percent: string]: Block | string | undefined;
};

export type SheetMap<T> = { [selector: string]: T };

export type ComponentBlock = Block & {
  '@fallbacks'?: PropertiesFallback;
  '@media'?: { [mediaQuery: string]: Block };
  '@selectors'?: { [selector: string]: Block };
  '@supports'?: { [featureQuery: string]: Block };
};

export type ComponentBlockNeverize<T> = T extends string
  ? string
  : { [K in keyof T]: K extends keyof ComponentBlock ? ComponentBlock[K] : never };

export type StyleSheet = SheetMap<ClassName | RawCss | ComponentBlock>;

export type StyleSheetNeverize<T> = { [K in keyof T]: ComponentBlockNeverize<T[K]> };

export type StyleSheetDefinition<Theme, T> = (
  theme: Theme,
) => T extends any ? StyleSheet : StyleSheet & StyleSheetNeverize<T>;

export type GlobalSheet = {
  '@charset'?: string;
  '@font-face'?: { [fontFamily: string]: FontFace | FontFace[] };
  '@global'?: { [selector: string]: Block };
  '@import'?: string | string[];
  '@keyframes'?: { [animationName: string]: Keyframes };
  '@page'?: Block;
  '@viewport'?: Block;
};

export type GlobalSheetNeverize<T> = {
  [K in keyof T]: K extends keyof GlobalSheet ? GlobalSheet[K] : never
};

export type GlobalSheetDefinition<Theme, T> =
  | ((theme: Theme) => GlobalSheet & GlobalSheetNeverize<T>)
  | null;
