/* eslint-disable @typescript-eslint/prefer-interface */

import CSS from 'csstype';
import { Omit } from 'utility-types';

// TERMINOLOGY
// https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax
// Declaration - The property and value pair.
// Block - A mapping of multiple declarations.
// Selector - The name of an element(s).
// Ruleset - The selector and block pair.
// StyleSheet = A mapping of multiple rulesets by selector.

export type ClassName = string;

export type RawCss = string;

export type ExtendedProperty<B, T> = B | T | (B | T)[];

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

export type StyleSheet = SheetMap<ClassName | RawCss | ComponentBlock>;

export type GlobalSheet = {
  '@charset'?: string;
  '@font-face'?: { [fontFamily: string]: FontFace | FontFace[] };
  '@global'?: { [selector: string]: Block };
  '@import'?: string | string[];
  '@keyframes'?: { [animationName: string]: Keyframes };
  '@page'?: Block;
  '@viewport'?: Block;
};
