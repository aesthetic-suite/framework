/* eslint-disable no-use-before-define */

import { Value, VariablesMap } from '@aesthetic/types';
import Block from './Block';

// GLOBAL STYLE SHEET

export type GlobalAtRule = '@font-face' | '@import' | '@keyframes' | '@root' | '@variables';

export interface GlobalStyleSheet<B = LocalBlock> {
  '@font-face'?: FontFaceMap;
  '@import'?: ImportList;
  '@keyframes'?: KeyframesMap;
  '@root'?: B;
  '@variables'?: VariablesMap;
}

export type GlobalStyleSheetNeverize<T, B> = {
  [K in keyof T]: K extends keyof GlobalStyleSheet<B> ? GlobalStyleSheet<B>[K] : never;
};

// MISC

export type AtRule = GlobalAtRule | LocalAtRule;

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

export type VariantListener<T extends object> = (
  parent: Block<T>,
  variant: string[] | string,
  value: Block<T>,
  params: NestedBlockParams,
) => void;

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
  onVariant?: VariantListener<T>;
  // Local
  onClass?: ClassNameListener;
  onRule?: RuleListener<T>;
  // Global
  onImport?: ImportListener;
  onRoot?: BlockListener<T>;
  onRootVariables?: VariablesListener;
}
