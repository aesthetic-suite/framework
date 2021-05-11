// eslint-disable-next-line import/no-unresolved
import CSSType from 'csstype';

export type { CSSType };

export type CSS = string;

// VALUES

export type Value = number | string;

export type ValueWithFallbacks = string[];

export type MaybeValue = Value | null | undefined;

// PROPERTIES

export type GenericProperties = Record<string, Value | ValueWithFallbacks>;

export interface Properties extends CSSType.Properties<Value>, CSSType.PropertiesHyphen<Value> {}

export type NativeProperty = keyof CSSType.PropertiesHyphen;

export type Property = keyof Properties;

// RULES

export type Attributes<T = Properties> = {
  [K in CSSType.HtmlAttributes]?: T;
};

export type Pseudos<T = Properties> = {
  [K in CSSType.SimplePseudos]?: T;
};

export type Declarations<T = Properties> = Attributes<T> & Pseudos<T> & T;

export interface Rule extends Declarations {
  [key: string]: Rule | Value | unknown;
}

// AT-RULES

export type FontFace = CSSType.AtRule.FontFace;

export interface Keyframes<T = Properties> {
  [percent: string]: T | undefined;
  from?: T;
  to?: T;
}

// OTHER

export type Unit = string;

export type UnitFactory = (property: NativeProperty) => Unit | undefined;

export type VariablesMap<T = Value> = Record<string, T>;
