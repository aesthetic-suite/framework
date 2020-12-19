/* eslint-disable no-use-before-define */

import CSSType from 'csstype';
import {
  FontFace as BaseFontFace,
  Keyframes as BaseKeyframes,
  Declarations,
  Value,
  VariablesMap,
} from '@aesthetic/types';
import Block from './Block';

export type ListableProperty<B, T> = T | (B | T)[];

// SYNTAX

export interface CustomProperties {
  animationName?: ListableProperty<CSSType.Property.AnimationName, Keyframes>;
  fontFamily?: ListableProperty<CSSType.Property.FontFamily, FontFace>;
}

export type ExtendCustomProperties<T extends object> = {
  [P in keyof T]?: P extends keyof CustomProperties ? T[P] | CustomProperties[P] : T[P];
};

export type Properties = ExtendCustomProperties<
  CSSType.StandardProperties<Value> & { clip?: string }
>;

export type FallbackProperties = CSSType.StandardPropertiesFallback<Value>;

export type Rule = Declarations<Properties>;

export type RuleMap<T> = Record<string, T>;

export interface FontFace extends BaseFontFace {
  local?: string[];
  srcPaths: string[];
}

export type FontFaceMap = Record<string, FontFace | FontFace[]>;

export interface Import {
  path: string;
  media?: string;
  url?: boolean;
}

export type ImportList = (string | Import)[];

export type Keyframes = BaseKeyframes<Rule>;

export type KeyframesMap = Record<string, Keyframes>;

// LOCAL STYLE SHEET

export type LocalAtRule =
  | '@fallbacks'
  | '@media'
  | '@selectors'
  | '@supports'
  | '@variables'
  | '@variants';

export type LocalBlock = Rule & {
  '@fallbacks'?: FallbackProperties;
  '@media'?: LocalBlockMap;
  '@selectors'?: LocalBlockMap;
  '@supports'?: LocalBlockMap;
  '@variables'?: VariablesMap;
  '@variants'?: LocalBlockVariants;
};

export type LocalBlockMap = Record<string, LocalBlock>;

export type LocalBlockVariants = Record<string, LocalBlockMap>;

export type LocalBlockNeverize<T> = {
  [K in keyof T]: K extends keyof LocalBlock ? T[K] : never;
};

export type LocalStyleSheet = RuleMap<string | LocalBlock>;

export type LocalStyleSheetNeverize<T> = {
  [K in keyof T]: T[K] extends string ? string : LocalBlockNeverize<T[K]>;
};

// GLOBAL STYLE SHEET

export type GlobalAtRule = '@font-face' | '@import' | '@keyframes' | '@root' | '@variables';

export interface GlobalStyleSheet {
  '@font-face'?: FontFaceMap;
  '@import'?: ImportList;
  '@keyframes'?: KeyframesMap;
  '@root'?: LocalBlock;
  '@variables'?: VariablesMap;
}

export type GlobalStyleSheetNeverize<T> = {
  [K in keyof T]: K extends keyof GlobalStyleSheet ? GlobalStyleSheet[K] : never;
};

// MISC

export type AtRule = LocalAtRule | GlobalAtRule;

export interface NestedBlockParams {
  specificity: number;
}

export type AddPropertyCallback = (property: string, value: Value | undefined) => void;

export type PropertyHandler<V> = (value: NonNullable<V>, add: AddPropertyCallback) => void;

export type PropertyHandlerMapInternal<T extends object> = {
  [P in keyof T]?: PropertyHandler<T[P]>;
};

export type PropertyHandlerMap = PropertyHandlerMapInternal<Properties>;

// EVENTS

export type ConditionListener<T extends object> = (
  parent: Block<T>,
  condition: string,
  value: Block<T>,
) => void;

export type NestedListener<T extends object> = (
  parent: Block<T>,
  name: string,
  value: Block<T>,
  params: NestedBlockParams,
) => void;

export type PropertyListener<T extends object> = (
  parent: Block<T>,
  name: string,
  value: unknown,
) => void;

export type BlockListener<T extends object> = (block: Block<T>) => void;

export type ClassNameListener = (selector: string, className: string) => void;

export type FontFaceListener<T extends object> = (
  fontFace: Block<T>,
  fontFamily: string,
  srcPaths: string[],
) => string;

export type ImportListener = (path: string) => void;

export type KeyframesListener<T extends object> = (
  keyframes: Block<T>,
  animationName: string | undefined,
) => string;

export type RuleListener<T extends object> = (selector: string, block: Block<T>) => void;

export type VariableListener<T extends object> = (
  block: Block<T>,
  name: string,
  value: Value,
) => void;

export type VariablesListener = (variables: VariablesMap) => void;

export interface ParserOptions<T extends object> {
  customProperties: PropertyHandlerMap;
  onAttribute?: NestedListener<T>;
  onBlock?: BlockListener<T>;
  onFallback?: PropertyListener<T>;
  onFontFace?: FontFaceListener<T>;
  onKeyframes?: KeyframesListener<T>;
  onMedia?: ConditionListener<T>;
  onProperty?: PropertyListener<T>;
  onPseudo?: NestedListener<T>;
  onSelector?: NestedListener<T>;
  onSupports?: ConditionListener<T>;
  onVariable?: VariableListener<T>;
  onVariant?: NestedListener<T>;
  // Local
  onClass?: ClassNameListener;
  onRule?: RuleListener<T>;
  // Global
  onImport?: ImportListener;
  onRoot?: BlockListener<T>;
  onRootVariables?: VariablesListener;
}
