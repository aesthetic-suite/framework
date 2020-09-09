// eslint-disable-next-line import/no-unresolved
import CSST from 'csstype';

export { CSST };

export type CSS = string;

// VALUES

export type Value = string | number;

export type MaybeValue = Value | undefined;

export type Unit = string;

export type UnitFactory = (property: NativeProperty) => Unit | undefined;

// PROPERTIES

export interface GenericProperties {
  [property: string]: Value | Value[];
}

export interface Properties extends CSST.Properties<Value>, CSST.PropertiesHyphen<Value> {}

export type NativeProperty = keyof CSST.PropertiesHyphen;

export type Property = keyof Properties;

// RULES

export type Attributes<T = Properties> = {
  [K in CSST.HtmlAttributes]?: T;
};

export type Pseudos<T = Properties> = {
  [K in CSST.SimplePseudos]?: T;
};

export type Declarations<T = Properties> = T & Attributes<T> & Pseudos<T>;

export interface Rule extends Declarations {
  [key: string]: Rule | Value | unknown;
}

// AT-RULES

export type FontFace = CSST.AtRule.FontFace;

export interface Keyframes<T = Properties> {
  [percent: string]: T | undefined;
  from?: T;
  to?: T;
}

// OTHER

export interface Variables<T = Value> {
  [variable: string]: T;
}
