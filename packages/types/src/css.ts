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

export interface Keyframes {
	[percent: string]: Properties | undefined;
	from?: Properties;
	to?: Properties;
}

export type KeyframesMap = Record<string, Keyframes>;

// PROPERTIES

export type WithCustomProperties<T extends object> = {
	[P in keyof T]: P extends keyof CustomProperties ? CustomProperties[P] | T[P] : T[P];
};

// export type WithFallbacks<T extends object> = {
//   [P in keyof T]: NonNullable<T[P]> | NonNullable<T[P]>[];
// };

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomProperties {}

export interface MissingProperties {
	clip?: string;
}

export type Properties = WithCustomProperties<
	CSSType.StandardProperties<Value> & MissingProperties
>;

export type Property = keyof Properties;

export type NativeProperty = keyof CSSType.StandardPropertiesHyphen<Value>;

export type GenericProperties = Record<string, Value | Value[]>;

// RULES

export type LocalAtRule = '@media' | '@selectors' | '@supports' | '@variables' | '@variants';

export type GlobalAtRule = '@font-face' | '@import' | '@keyframes' | '@root' | '@variables';

export type AtRule = GlobalAtRule | LocalAtRule;

export type Attributes<T> = {
	[K in CSSType.HtmlAttributes]?: T;
};

export type Pseudos<T> = {
	[K in CSSType.SimplePseudos]?: T;
};

export type Declarations<T> = Attributes<T> & Pseudos<T> & T;

export interface RuleWithoutVariants extends Declarations<Properties> {
	'@media'?: RuleMap<RuleWithoutVariants>;
	'@selectors'?: RuleMap<RuleWithoutVariants>;
	'@supports'?: RuleMap<RuleWithoutVariants>;
	'@variables'?: VariablesMap;
}

export interface Rule extends RuleWithoutVariants {
	'@variants'?: RuleMap<RuleWithoutVariants>;
}

export type RuleMap<T = Rule> = Record<string, T>;

export interface ThemeRule<T = Rule> {
	'@font-face'?: FontFaceMap;
	'@import'?: ImportList;
	'@keyframes'?: KeyframesMap;
	'@root'?: T;
	'@variables'?: VariablesMap;
}

// OTHER

export type Unit = string;

export type UnitFactory = (property: NativeProperty) => Unit | undefined;

export type VariablesMap<T = Value> = Record<string, T>;
