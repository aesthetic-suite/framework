import { Unit } from '@aesthetic/types';

export type Hexcode = string;

export type CommonSize = 'sm' | 'df' | 'lg';

export type BorderSize = CommonSize;

export type BreakpointSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ColorScheme = 'dark' | 'light';

export type ContrastLevel = 'normal' | 'high' | 'low';

export type HeadingSize = 'l1' | 'l2' | 'l3' | 'l4' | 'l5' | 'l6';

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
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'neutral'
  | 'muted'
  | 'danger'
  | 'warning'
  | 'failure'
  | 'success'
  | 'info';

export type ShadowSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SpacingSize = 'xs' | CommonSize | 'md' | 'xl';

export type TextSize = CommonSize;

export type ColorShade = '00' | '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90';

export type StateType = 'focused' | 'hovered' | 'selected' | 'disabled';

// TOKENS

export interface BorderToken {
  radius: Unit;
  width: Unit;
}

export type BorderTokens = Record<BorderSize, BorderToken>;

export interface BreakpointToken {
  query: string;
  querySize: number;
  rootLineHeight: number;
  rootTextSize: Unit;
}

export type BreakpointTokens = Record<BreakpointSize, BreakpointToken>;

export type DepthTokens = Record<ElevationType, number>;

export type ColorRangeToken = Record<ColorShade, Hexcode>;

export type ColorStateToken = {
  base: Hexcode;
} & Record<StateType, Hexcode>;

export interface ShadowToken {
  blur: Unit;
  spread: Unit;
  x: Unit;
  y: Unit;
}

export type ShadowTokens = Record<ShadowSize, ShadowToken>;

export type SpacingTokens = Record<SpacingSize, Unit> & {
  type: string;
  unit: number;
};

export interface HeadingToken {
  letterSpacing: Unit;
  lineHeight: number;
  size: Unit;
}

export type HeadingTokens = Record<HeadingSize, HeadingToken>;

export interface TextToken {
  lineHeight: number;
  size: Unit;
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
  rootTextSize: Unit;
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
  'border-sm-radius': Unit;
  'border-sm-width': Unit;
  'border-df-radius': Unit;
  'border-df-width': Unit;
  'border-lg-radius': Unit;
  'border-lg-width': Unit;
  'breakpoint-xs-query': string;
  'breakpoint-xs-query-size': number;
  'breakpoint-xs-root-line-height': number;
  'breakpoint-xs-root-text-size': Unit;
  'breakpoint-sm-query': string;
  'breakpoint-sm-query-size': number;
  'breakpoint-sm-root-line-height': number;
  'breakpoint-sm-root-text-size': Unit;
  'breakpoint-md-query': string;
  'breakpoint-md-query-size': number;
  'breakpoint-md-root-line-height': number;
  'breakpoint-md-root-text-size': Unit;
  'breakpoint-lg-query': string;
  'breakpoint-lg-query-size': number;
  'breakpoint-lg-root-line-height': number;
  'breakpoint-lg-root-text-size': Unit;
  'breakpoint-xl-query': string;
  'breakpoint-xl-query-size': number;
  'breakpoint-xl-root-line-height': number;
  'breakpoint-xl-root-text-size': Unit;
  'depth-content': number;
  'depth-dialog': number;
  'depth-menu': number;
  'depth-modal': number;
  'depth-navigation': number;
  'depth-overlay': number;
  'depth-sheet': number;
  'depth-toast': number;
  'depth-tooltip': number;
  'heading-l1-letter-spacing': Unit;
  'heading-l1-line-height': number;
  'heading-l1-size': Unit;
  'heading-l2-letter-spacing': Unit;
  'heading-l2-line-height': number;
  'heading-l2-size': Unit;
  'heading-l3-letter-spacing': Unit;
  'heading-l3-line-height': number;
  'heading-l3-size': Unit;
  'heading-l4-letter-spacing': Unit;
  'heading-l4-line-height': number;
  'heading-l4-size': Unit;
  'heading-l5-letter-spacing': Unit;
  'heading-l5-line-height': number;
  'heading-l5-size': Unit;
  'heading-l6-letter-spacing': Unit;
  'heading-l6-line-height': number;
  'heading-l6-size': Unit;
  'shadow-xs-blur': Unit;
  'shadow-xs-spread': Unit;
  'shadow-xs-x': Unit;
  'shadow-xs-y': Unit;
  'shadow-sm-blur': Unit;
  'shadow-sm-spread': Unit;
  'shadow-sm-x': Unit;
  'shadow-sm-y': Unit;
  'shadow-md-blur': Unit;
  'shadow-md-spread': Unit;
  'shadow-md-x': Unit;
  'shadow-md-y': Unit;
  'shadow-lg-blur': Unit;
  'shadow-lg-spread': Unit;
  'shadow-lg-x': Unit;
  'shadow-lg-y': Unit;
  'shadow-xl-blur': Unit;
  'shadow-xl-spread': Unit;
  'shadow-xl-x': Unit;
  'shadow-xl-y': Unit;
  'spacing-xs': Unit;
  'spacing-sm': Unit;
  'spacing-df': Unit;
  'spacing-md': Unit;
  'spacing-lg': Unit;
  'spacing-xl': Unit;
  'spacing-unit': number;
  'text-sm-line-height': number;
  'text-sm-size': Unit;
  'text-df-line-height': number;
  'text-df-size': Unit;
  'text-lg-line-height': number;
  'text-lg-size': Unit;
  'typography-font-heading': string;
  'typography-font-monospace': string;
  'typography-font-text': string;
  'typography-font-system': string;
  'typography-root-line-height': number;
  'typography-root-text-size': Unit;
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
  'palette-failure-bg-base': Hexcode;
  'palette-failure-bg-disabled': Hexcode;
  'palette-failure-bg-focused': Hexcode;
  'palette-failure-bg-hovered': Hexcode;
  'palette-failure-bg-selected': Hexcode;
  'palette-failure-color-00': Hexcode;
  'palette-failure-color-10': Hexcode;
  'palette-failure-color-20': Hexcode;
  'palette-failure-color-30': Hexcode;
  'palette-failure-color-40': Hexcode;
  'palette-failure-color-50': Hexcode;
  'palette-failure-color-60': Hexcode;
  'palette-failure-color-70': Hexcode;
  'palette-failure-color-80': Hexcode;
  'palette-failure-color-90': Hexcode;
  'palette-failure-fg-base': Hexcode;
  'palette-failure-fg-disabled': Hexcode;
  'palette-failure-fg-focused': Hexcode;
  'palette-failure-fg-hovered': Hexcode;
  'palette-failure-fg-selected': Hexcode;
  'palette-failure-text': Hexcode;
  'palette-info-bg-base': Hexcode;
  'palette-info-bg-disabled': Hexcode;
  'palette-info-bg-focused': Hexcode;
  'palette-info-bg-hovered': Hexcode;
  'palette-info-bg-selected': Hexcode;
  'palette-info-color-00': Hexcode;
  'palette-info-color-10': Hexcode;
  'palette-info-color-20': Hexcode;
  'palette-info-color-30': Hexcode;
  'palette-info-color-40': Hexcode;
  'palette-info-color-50': Hexcode;
  'palette-info-color-60': Hexcode;
  'palette-info-color-70': Hexcode;
  'palette-info-color-80': Hexcode;
  'palette-info-color-90': Hexcode;
  'palette-info-fg-base': Hexcode;
  'palette-info-fg-disabled': Hexcode;
  'palette-info-fg-focused': Hexcode;
  'palette-info-fg-hovered': Hexcode;
  'palette-info-fg-selected': Hexcode;
  'palette-info-text': Hexcode;
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
  'palette-success-bg-base': Hexcode;
  'palette-success-bg-disabled': Hexcode;
  'palette-success-bg-focused': Hexcode;
  'palette-success-bg-hovered': Hexcode;
  'palette-success-bg-selected': Hexcode;
  'palette-success-color-00': Hexcode;
  'palette-success-color-10': Hexcode;
  'palette-success-color-20': Hexcode;
  'palette-success-color-30': Hexcode;
  'palette-success-color-40': Hexcode;
  'palette-success-color-50': Hexcode;
  'palette-success-color-60': Hexcode;
  'palette-success-color-70': Hexcode;
  'palette-success-color-80': Hexcode;
  'palette-success-color-90': Hexcode;
  'palette-success-fg-base': Hexcode;
  'palette-success-fg-disabled': Hexcode;
  'palette-success-fg-focused': Hexcode;
  'palette-success-fg-hovered': Hexcode;
  'palette-success-fg-selected': Hexcode;
  'palette-success-text': Hexcode;
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

export type VarUtil = (name: VariableName, ...fallbacks: (string | number)[]) => string;

export type UnitUtil = (...sizes: number[]) => Unit;

// MIXINS

export type MixinTemplate<T extends object, O extends object = object> = (options: O) => T;

export type MixinTemplateMap<T extends object> = Record<string, MixinTemplate<T>>;

export interface Mixin<T extends object, O extends object = object> {
  (options: O, rule: T): T;
  (rule?: T): T;
}

// Used for augmentation downstream
// eslint-disable-next-line
export interface Mixins<T extends object> {}

export interface MixinUtil<T extends object, O extends object = object> extends Mixins<T> {
  (name: string, options: O, rule: T): T;
  (name: string, rule?: T): T;
}

// OTHER

export interface Utilities<T extends object> {
  contrast: ContrastLevel;
  mixin: MixinUtil<T>;
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
