/* eslint-disable no-use-before-define */

// eslint-disable-next-line import/no-unresolved
import CSSType from 'csstype';

export type { CSSType };

export type CSS = string;

// VALUES

export type Value = number | string;

export type ValueWithFallbacks = string[];

export type MaybeValue = Value | null | undefined;

// AT-RULES

export interface FontFace extends CSSType.AtRule.FontFace {
  local?: string[];
  srcPaths?: string[];
}

export type FontFaceMap = Record<string, FontFace | FontFace[]>;

export interface Import {
  path: string;
  media?: string;
  url?: boolean;
}

export type ImportList = (Import | string)[];

export interface Keyframes<T = Properties> {
  [percent: string]: T | undefined;
  from?: T;
  to?: T;
}

export type KeyframesMap = Record<string, Keyframes>;

// PROPERTIES

export type ListableProperty<B, T> = (B | T)[] | T;

export interface CustomProperties {
  animationName?: ListableProperty<CSSType.Property.AnimationName, Keyframes>;
  fontFamily?: ListableProperty<CSSType.Property.FontFamily, FontFace>;
}

export type ExtendCustomProperties<T extends object> = {
  [P in keyof T]?: P extends keyof CustomProperties ? CustomProperties[P] | T[P] : T[P];
};

export type FallbackProperties = CSSType.StandardPropertiesFallback<Value> &
  CSSType.StandardPropertiesHyphenFallback;

export type Properties = CSSType.StandardPropertiesHyphen &
  ExtendCustomProperties<CSSType.StandardProperties<Value>> & {
    clip?: string;
  };

export type Property = keyof Properties;

export type NativeProperty = keyof CSSType.PropertiesHyphen;

export type GenericProperties = Record<string, Value | ValueWithFallbacks>;

// RULES

export type LocalAtRule =
  | '@fallbacks'
  | '@media'
  | '@selectors'
  | '@supports'
  | '@variables'
  | '@variants';

export type Attributes<T = Properties> = {
  [K in CSSType.HtmlAttributes]?: T;
};

export type Pseudos<T = Properties> = {
  [K in CSSType.SimplePseudos]?: T;
};

export type Declarations<T = Properties> = Attributes<T> & Pseudos<T> & T;

export type Rule = Declarations<Properties> & {
  [key: string]: Rule | Value | unknown;
  '@media'?: RuleMap;
  '@supports'?: RuleMap;
};

export type RuleMap<T = Rule> = Record<string, T>;

// OTHER

export type Unit = string;

export type UnitFactory = (property: NativeProperty) => Unit | undefined;

export type VariablesMap<T = Value> = Record<string, T>;
