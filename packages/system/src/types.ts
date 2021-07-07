import { ColorScheme, ContrastLevel, UnitValue } from '@aesthetic/types';

export type Hexcode = string;

export type CommonSize = 'df' | 'lg' | 'sm';

export type BorderSize = CommonSize;

export type BreakpointSize = 'lg' | 'md' | 'sm' | 'xl' | 'xs';

export type HeadingSize = 'l1' | 'l2' | 'l3' | 'l4' | 'l5' | 'l6';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type ElevationType =
	| 'content'
	| 'dialog'
	| 'menu'
	| 'modal'
	| 'navigation'
	| 'overlay'
	| 'sheet'
	| 'toast'
	| 'tooltip';

export type PaletteType =
	| 'brand'
	| 'danger'
	| 'muted'
	| 'negative'
	| 'neutral'
	| 'positive'
	| 'primary'
	| 'secondary'
	| 'tertiary'
	| 'warning';

export type ShadowSize = 'lg' | 'md' | 'sm' | 'xl' | 'xs';

export type SpacingSize = CommonSize | 'md' | 'xl' | 'xs' | 'xxl' | 'xxs';

export type TextSize = CommonSize;

export type ColorShade = '00' | '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90';

export type StateType = 'disabled' | 'focused' | 'hovered' | 'selected';

// TOKENS

export interface BorderToken {
	radius: UnitValue;
	width: UnitValue;
}

export type BorderTokens = Record<BorderSize, BorderToken>;

export interface BreakpointToken {
	query: string;
	querySize: number;
	rootLineHeight: number;
	rootTextSize: UnitValue;
}

export type BreakpointTokens = Record<BreakpointSize, BreakpointToken>;

export type DepthTokens = Record<ElevationType, number>;

export type ColorRangeToken = Record<ColorShade, Hexcode>;

export type ColorStateToken = Record<StateType, Hexcode> & {
	base: Hexcode;
};

export interface ShadowToken {
	blur: UnitValue;
	spread: UnitValue;
	x: UnitValue;
	y: UnitValue;
}

export type ShadowTokens = Record<ShadowSize, ShadowToken>;

export type SpacingTokens = Record<SpacingSize, UnitValue> & {
	type: string;
	unit: number;
};

export interface HeadingToken {
	letterSpacing: UnitValue;
	lineHeight: number;
	size: UnitValue;
}

export type HeadingTokens = Record<HeadingSize, HeadingToken>;

export interface TextToken {
	lineHeight: number;
	size: UnitValue;
}

export type TextTokens = Record<TextSize, TextToken>;

export interface TypographyToken {
	font: {
		heading: string;
		locale: Record<string, string>;
		monospace: string;
		text: string;
		system: string;
	};
	rootLineHeight: number;
	rootTextSize: UnitValue;
}

export interface DesignTokens {
	border: BorderTokens;
	breakpoint: BreakpointTokens;
	depth: DepthTokens;
	heading: HeadingTokens;
	shadow: ShadowTokens;
	spacing: SpacingTokens;
	text: TextTokens;
	typography: TypographyToken;
}

// Keep roughly in sync with the tokens above
export interface DesignVariables {
	'border-sm-radius': UnitValue;
	'border-sm-width': UnitValue;
	'border-df-radius': UnitValue;
	'border-df-width': UnitValue;
	'border-lg-radius': UnitValue;
	'border-lg-width': UnitValue;
	'breakpoint-xs-query': string;
	'breakpoint-xs-query-size': number;
	'breakpoint-xs-root-line-height': number;
	'breakpoint-xs-root-text-size': UnitValue;
	'breakpoint-sm-query': string;
	'breakpoint-sm-query-size': number;
	'breakpoint-sm-root-line-height': number;
	'breakpoint-sm-root-text-size': UnitValue;
	'breakpoint-md-query': string;
	'breakpoint-md-query-size': number;
	'breakpoint-md-root-line-height': number;
	'breakpoint-md-root-text-size': UnitValue;
	'breakpoint-lg-query': string;
	'breakpoint-lg-query-size': number;
	'breakpoint-lg-root-line-height': number;
	'breakpoint-lg-root-text-size': UnitValue;
	'breakpoint-xl-query': string;
	'breakpoint-xl-query-size': number;
	'breakpoint-xl-root-line-height': number;
	'breakpoint-xl-root-text-size': UnitValue;
	'depth-content': number;
	'depth-dialog': number;
	'depth-menu': number;
	'depth-modal': number;
	'depth-navigation': number;
	'depth-overlay': number;
	'depth-sheet': number;
	'depth-toast': number;
	'depth-tooltip': number;
	'heading-l1-letter-spacing': UnitValue;
	'heading-l1-line-height': number;
	'heading-l1-size': UnitValue;
	'heading-l2-letter-spacing': UnitValue;
	'heading-l2-line-height': number;
	'heading-l2-size': UnitValue;
	'heading-l3-letter-spacing': UnitValue;
	'heading-l3-line-height': number;
	'heading-l3-size': UnitValue;
	'heading-l4-letter-spacing': UnitValue;
	'heading-l4-line-height': number;
	'heading-l4-size': UnitValue;
	'heading-l5-letter-spacing': UnitValue;
	'heading-l5-line-height': number;
	'heading-l5-size': UnitValue;
	'heading-l6-letter-spacing': UnitValue;
	'heading-l6-line-height': number;
	'heading-l6-size': UnitValue;
	'shadow-xs-blur': UnitValue;
	'shadow-xs-spread': UnitValue;
	'shadow-xs-x': UnitValue;
	'shadow-xs-y': UnitValue;
	'shadow-sm-blur': UnitValue;
	'shadow-sm-spread': UnitValue;
	'shadow-sm-x': UnitValue;
	'shadow-sm-y': UnitValue;
	'shadow-md-blur': UnitValue;
	'shadow-md-spread': UnitValue;
	'shadow-md-x': UnitValue;
	'shadow-md-y': UnitValue;
	'shadow-lg-blur': UnitValue;
	'shadow-lg-spread': UnitValue;
	'shadow-lg-x': UnitValue;
	'shadow-lg-y': UnitValue;
	'shadow-xl-blur': UnitValue;
	'shadow-xl-spread': UnitValue;
	'shadow-xl-x': UnitValue;
	'shadow-xl-y': UnitValue;
	'spacing-xxs': UnitValue;
	'spacing-xs': UnitValue;
	'spacing-sm': UnitValue;
	'spacing-df': UnitValue;
	'spacing-md': UnitValue;
	'spacing-lg': UnitValue;
	'spacing-xl': UnitValue;
	'spacing-xxl': UnitValue;
	'spacing-unit': number;
	'text-sm-line-height': number;
	'text-sm-size': UnitValue;
	'text-df-line-height': number;
	'text-df-size': UnitValue;
	'text-lg-line-height': number;
	'text-lg-size': UnitValue;
	'typography-font-heading': string;
	'typography-font-monospace': string;
	'typography-font-text': string;
	'typography-font-system': string;
	'typography-root-line-height': number;
	'typography-root-text-size': UnitValue;
}

export interface PaletteToken {
	color: ColorRangeToken;
	bg: ColorStateToken;
	fg: ColorStateToken;
	text: Hexcode;
}

export type PaletteTokens = Record<PaletteType, PaletteToken>;

export interface ThemeTokens {
	palette: PaletteTokens;
}

// Keep in sync with the tokens above
export interface ThemeVariables {
	'palette-brand-bg-base': Hexcode;
	'palette-brand-bg-disabled': Hexcode;
	'palette-brand-bg-focused': Hexcode;
	'palette-brand-bg-hovered': Hexcode;
	'palette-brand-bg-selected': Hexcode;
	'palette-brand-color-00': Hexcode;
	'palette-brand-color-10': Hexcode;
	'palette-brand-color-20': Hexcode;
	'palette-brand-color-30': Hexcode;
	'palette-brand-color-40': Hexcode;
	'palette-brand-color-50': Hexcode;
	'palette-brand-color-60': Hexcode;
	'palette-brand-color-70': Hexcode;
	'palette-brand-color-80': Hexcode;
	'palette-brand-color-90': Hexcode;
	'palette-brand-fg-base': Hexcode;
	'palette-brand-fg-disabled': Hexcode;
	'palette-brand-fg-focused': Hexcode;
	'palette-brand-fg-hovered': Hexcode;
	'palette-brand-fg-selected': Hexcode;
	'palette-brand-text': Hexcode;
	'palette-danger-bg-base': Hexcode;
	'palette-danger-bg-disabled': Hexcode;
	'palette-danger-bg-focused': Hexcode;
	'palette-danger-bg-hovered': Hexcode;
	'palette-danger-bg-selected': Hexcode;
	'palette-danger-color-00': Hexcode;
	'palette-danger-color-10': Hexcode;
	'palette-danger-color-20': Hexcode;
	'palette-danger-color-30': Hexcode;
	'palette-danger-color-40': Hexcode;
	'palette-danger-color-50': Hexcode;
	'palette-danger-color-60': Hexcode;
	'palette-danger-color-70': Hexcode;
	'palette-danger-color-80': Hexcode;
	'palette-danger-color-90': Hexcode;
	'palette-danger-fg-base': Hexcode;
	'palette-danger-fg-disabled': Hexcode;
	'palette-danger-fg-focused': Hexcode;
	'palette-danger-fg-hovered': Hexcode;
	'palette-danger-fg-selected': Hexcode;
	'palette-danger-text': Hexcode;
	'palette-muted-bg-base': Hexcode;
	'palette-muted-bg-disabled': Hexcode;
	'palette-muted-bg-focused': Hexcode;
	'palette-muted-bg-hovered': Hexcode;
	'palette-muted-bg-selected': Hexcode;
	'palette-muted-color-00': Hexcode;
	'palette-muted-color-10': Hexcode;
	'palette-muted-color-20': Hexcode;
	'palette-muted-color-30': Hexcode;
	'palette-muted-color-40': Hexcode;
	'palette-muted-color-50': Hexcode;
	'palette-muted-color-60': Hexcode;
	'palette-muted-color-70': Hexcode;
	'palette-muted-color-80': Hexcode;
	'palette-muted-color-90': Hexcode;
	'palette-muted-fg-base': Hexcode;
	'palette-muted-fg-disabled': Hexcode;
	'palette-muted-fg-focused': Hexcode;
	'palette-muted-fg-hovered': Hexcode;
	'palette-muted-fg-selected': Hexcode;
	'palette-muted-text': Hexcode;
	'palette-negative-bg-base': Hexcode;
	'palette-negative-bg-disabled': Hexcode;
	'palette-negative-bg-focused': Hexcode;
	'palette-negative-bg-hovered': Hexcode;
	'palette-negative-bg-selected': Hexcode;
	'palette-negative-color-00': Hexcode;
	'palette-negative-color-10': Hexcode;
	'palette-negative-color-20': Hexcode;
	'palette-negative-color-30': Hexcode;
	'palette-negative-color-40': Hexcode;
	'palette-negative-color-50': Hexcode;
	'palette-negative-color-60': Hexcode;
	'palette-negative-color-70': Hexcode;
	'palette-negative-color-80': Hexcode;
	'palette-negative-color-90': Hexcode;
	'palette-negative-fg-base': Hexcode;
	'palette-negative-fg-disabled': Hexcode;
	'palette-negative-fg-focused': Hexcode;
	'palette-negative-fg-hovered': Hexcode;
	'palette-negative-fg-selected': Hexcode;
	'palette-negative-text': Hexcode;
	'palette-neutral-bg-base': Hexcode;
	'palette-neutral-bg-disabled': Hexcode;
	'palette-neutral-bg-focused': Hexcode;
	'palette-neutral-bg-hovered': Hexcode;
	'palette-neutral-bg-selected': Hexcode;
	'palette-neutral-color-00': Hexcode;
	'palette-neutral-color-10': Hexcode;
	'palette-neutral-color-20': Hexcode;
	'palette-neutral-color-30': Hexcode;
	'palette-neutral-color-40': Hexcode;
	'palette-neutral-color-50': Hexcode;
	'palette-neutral-color-60': Hexcode;
	'palette-neutral-color-70': Hexcode;
	'palette-neutral-color-80': Hexcode;
	'palette-neutral-color-90': Hexcode;
	'palette-neutral-fg-base': Hexcode;
	'palette-neutral-fg-disabled': Hexcode;
	'palette-neutral-fg-focused': Hexcode;
	'palette-neutral-fg-hovered': Hexcode;
	'palette-neutral-fg-selected': Hexcode;
	'palette-neutral-text': Hexcode;
	'palette-positive-bg-base': Hexcode;
	'palette-positive-bg-disabled': Hexcode;
	'palette-positive-bg-focused': Hexcode;
	'palette-positive-bg-hovered': Hexcode;
	'palette-positive-bg-selected': Hexcode;
	'palette-positive-color-00': Hexcode;
	'palette-positive-color-10': Hexcode;
	'palette-positive-color-20': Hexcode;
	'palette-positive-color-30': Hexcode;
	'palette-positive-color-40': Hexcode;
	'palette-positive-color-50': Hexcode;
	'palette-positive-color-60': Hexcode;
	'palette-positive-color-70': Hexcode;
	'palette-positive-color-80': Hexcode;
	'palette-positive-color-90': Hexcode;
	'palette-positive-fg-base': Hexcode;
	'palette-positive-fg-disabled': Hexcode;
	'palette-positive-fg-focused': Hexcode;
	'palette-positive-fg-hovered': Hexcode;
	'palette-positive-fg-selected': Hexcode;
	'palette-positive-text': Hexcode;
	'palette-primary-bg-base': Hexcode;
	'palette-primary-bg-disabled': Hexcode;
	'palette-primary-bg-focused': Hexcode;
	'palette-primary-bg-hovered': Hexcode;
	'palette-primary-bg-selected': Hexcode;
	'palette-primary-color-00': Hexcode;
	'palette-primary-color-10': Hexcode;
	'palette-primary-color-20': Hexcode;
	'palette-primary-color-30': Hexcode;
	'palette-primary-color-40': Hexcode;
	'palette-primary-color-50': Hexcode;
	'palette-primary-color-60': Hexcode;
	'palette-primary-color-70': Hexcode;
	'palette-primary-color-80': Hexcode;
	'palette-primary-color-90': Hexcode;
	'palette-primary-fg-base': Hexcode;
	'palette-primary-fg-disabled': Hexcode;
	'palette-primary-fg-focused': Hexcode;
	'palette-primary-fg-hovered': Hexcode;
	'palette-primary-fg-selected': Hexcode;
	'palette-primary-text': Hexcode;
	'palette-secondary-bg-base': Hexcode;
	'palette-secondary-bg-disabled': Hexcode;
	'palette-secondary-bg-focused': Hexcode;
	'palette-secondary-bg-hovered': Hexcode;
	'palette-secondary-bg-selected': Hexcode;
	'palette-secondary-color-00': Hexcode;
	'palette-secondary-color-10': Hexcode;
	'palette-secondary-color-20': Hexcode;
	'palette-secondary-color-30': Hexcode;
	'palette-secondary-color-40': Hexcode;
	'palette-secondary-color-50': Hexcode;
	'palette-secondary-color-60': Hexcode;
	'palette-secondary-color-70': Hexcode;
	'palette-secondary-color-80': Hexcode;
	'palette-secondary-color-90': Hexcode;
	'palette-secondary-fg-base': Hexcode;
	'palette-secondary-fg-disabled': Hexcode;
	'palette-secondary-fg-focused': Hexcode;
	'palette-secondary-fg-hovered': Hexcode;
	'palette-secondary-fg-selected': Hexcode;
	'palette-secondary-text': Hexcode;
	'palette-tertiary-bg-base': Hexcode;
	'palette-tertiary-bg-disabled': Hexcode;
	'palette-tertiary-bg-focused': Hexcode;
	'palette-tertiary-bg-hovered': Hexcode;
	'palette-tertiary-bg-selected': Hexcode;
	'palette-tertiary-color-00': Hexcode;
	'palette-tertiary-color-10': Hexcode;
	'palette-tertiary-color-20': Hexcode;
	'palette-tertiary-color-30': Hexcode;
	'palette-tertiary-color-40': Hexcode;
	'palette-tertiary-color-50': Hexcode;
	'palette-tertiary-color-60': Hexcode;
	'palette-tertiary-color-70': Hexcode;
	'palette-tertiary-color-80': Hexcode;
	'palette-tertiary-color-90': Hexcode;
	'palette-tertiary-fg-base': Hexcode;
	'palette-tertiary-fg-disabled': Hexcode;
	'palette-tertiary-fg-focused': Hexcode;
	'palette-tertiary-fg-hovered': Hexcode;
	'palette-tertiary-fg-selected': Hexcode;
	'palette-tertiary-text': Hexcode;
	'palette-warning-bg-base': Hexcode;
	'palette-warning-bg-disabled': Hexcode;
	'palette-warning-bg-focused': Hexcode;
	'palette-warning-bg-hovered': Hexcode;
	'palette-warning-bg-selected': Hexcode;
	'palette-warning-color-00': Hexcode;
	'palette-warning-color-10': Hexcode;
	'palette-warning-color-20': Hexcode;
	'palette-warning-color-30': Hexcode;
	'palette-warning-color-40': Hexcode;
	'palette-warning-color-50': Hexcode;
	'palette-warning-color-60': Hexcode;
	'palette-warning-color-70': Hexcode;
	'palette-warning-color-80': Hexcode;
	'palette-warning-color-90': Hexcode;
	'palette-warning-fg-base': Hexcode;
	'palette-warning-fg-disabled': Hexcode;
	'palette-warning-fg-focused': Hexcode;
	'palette-warning-fg-hovered': Hexcode;
	'palette-warning-fg-selected': Hexcode;
	'palette-warning-text': Hexcode;
}

export type Tokens = DesignTokens & ThemeTokens;

export type Variables = DesignVariables & ThemeVariables;

export type VariableName = keyof Variables;

export type TokenUtil = <K extends VariableName>(name: K) => Variables[K];

export type VarUtil = (name: VariableName, ...fallbacks: (number | string)[]) => string;

export type UnitUtil = (...sizes: number[]) => UnitValue;

// MIXINS

export type MixinType =
	| 'hide-offscreen'
	| 'hide-visually'
	| 'reset-button'
	| 'reset-input'
	| 'reset-list'
	| 'reset-media'
	| 'reset-typography'
	| 'root'
	| 'text-break'
	| 'text-truncate'
	| 'text-wrap';

export type MixinTemplate<Block extends object> = (utils: Utilities<Block>) => Block;

export type MixinUtil<Block extends object> = (name: MixinType, rule?: Block) => Block;

// OTHER

export interface Utilities<Block extends object> {
	contrast: ContrastLevel;
	mixin: MixinUtil<Block>;
	scheme: ColorScheme;
	tokens: Tokens;
	unit: UnitUtil;
	var: VarUtil;
}

export interface ThemeOptions {
	contrast: ContrastLevel;
	scheme: ColorScheme;
}

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? DeepPartial<U>[]
		: T[P] extends readonly (infer U)[]
		? readonly DeepPartial<U>[]
		: DeepPartial<T[P]>;
};
