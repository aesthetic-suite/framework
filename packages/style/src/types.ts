// eslint-disable-next-line import/no-unresolved
import CSS from 'csstype';

export type ClassName = string;

export type Value = string | number;

export interface GenericProperties {
  [key: string]: Value | Value[];
}

export type Properties = CSS.Properties<Value> & CSS.PropertiesHyphen<Value>;

export type Property = keyof Properties;

export type AttributeBlock = {
  [K in CSS.HtmlAttributes]?: Properties;
};

export type PseudoBlock = {
  [K in CSS.SimplePseudos]?: Properties;
};

export type DeclarationBlock = Properties & AttributeBlock & PseudoBlock;

export interface Rule extends DeclarationBlock {
  [key: string]: Rule | Value | unknown;
}

export type FontFace = Omit<CSS.FontFace, 'fontFamily'> & { fontFamily: string };

export interface Keyframes {
  [percent: string]: Properties | undefined;
  from?: Properties;
  to?: Properties;
}

export type SheetType = 'global' | 'standard' | 'conditions';

export interface Condition {
  query: string;
  type: number;
}

export interface RankCache {
  [property: string]: number;
}

export interface ProcessOptions {
  deterministic?: boolean;
  rankings?: RankCache;
  rtl?: boolean;
  vendor?: boolean;
}

export interface RenderOptions extends ProcessOptions {
  className?: ClassName;
  conditions?: Condition[];
  selector?: string;
  type?: SheetType;
}

export interface CacheItem extends Required<Omit<RenderOptions, keyof ProcessOptions>> {
  rank: number;
}

export interface CSSVariables<T = Value> {
  [key: string]: T;
}

export interface StyleRule {
  conditionText?: string;
  cssRules: StyleRule[];
  cssText: string;
  cssVariables: CSSVariables<string>;
  type: number;
  insertRule: (rule: string, index: number) => number;
}

// DATA

export interface PrefixMap {
  [value: string]: number;
}

export interface DeclarationPrefixMap {
  [property: string]: {
    prefixes?: number;
    functions?: PrefixMap;
    values?: PrefixMap;
  };
}
