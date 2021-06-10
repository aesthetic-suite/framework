/* eslint-disable no-use-before-define */

// eslint-disable-next-line import/no-unresolved
import CSSType from 'csstype';

export type { CSSType };

export type CSS = string;

export type Value = number | string;

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

export type WithFallbacks<T> = {
  [P in keyof T]: NonNullable<T[P]> | NonNullable<T[P]>[];
};

export type Properties = WithFallbacks<
  CSSType.StandardProperties<Value> &
    CSSType.StandardPropertiesHyphen<Value> & {
      clip?: string;
    }
>;

export type Property = keyof Properties;

export type NativeProperty = keyof CSSType.PropertiesHyphen;

export type GenericProperties = Record<string, Value | Value[]>;

// RULES

export type LocalAtRule = '@media' | '@selectors' | '@supports' | '@variables' | '@variants';

export type Attributes<T = Properties> = {
  [K in CSSType.HtmlAttributes]?: T;
};

export type Pseudos<T = Properties> = {
  [K in CSSType.SimplePseudos]?: T;
};

export type Declarations<T = Properties> = Attributes<T> & Pseudos<T> & T;

export interface Rule extends Declarations<Properties> {
  '@media'?: RuleMap;
  '@selectors'?: RuleMap;
  '@supports'?: RuleMap;
  '@variables'?: VariablesMap;
}

export type RuleMap<T = Rule> = Record<string, T>;

// OTHER

export type Unit = string;

export type UnitFactory = (property: NativeProperty) => Unit | undefined;

export type VariablesMap<T = Value> = Record<string, T>;
