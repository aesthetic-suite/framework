import { DeclarationBlock } from '@aesthetic/sss';

export type Unit = string;

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
  | 'success'
  | 'info';

export type ShadowSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SpacingSize = 'xs' | CommonSize | 'md' | 'xl';

export type TextSize = CommonSize;

export type ColorShade = '00' | '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90';

// TOKENS

export interface BorderToken {
  radius: Unit;
  width: Unit;
}

export interface BreakpointToken {
  query: string;
  querySize: number;
  rootLineHeight: number;
  rootTextSize: Unit;
}

export type ColorRangeToken = { [K in ColorShade]: Hexcode };

export interface ColorStateToken {
  base: Hexcode;
  disabled: Hexcode;
  focused: Hexcode;
  hovered: Hexcode;
  selected: Hexcode;
}

export interface ShadowToken {
  blur: Unit;
  spread: Unit;
  x: Unit;
  y: Unit;
}

export interface HeadingToken {
  letterSpacing: Unit;
  lineHeight: number;
  size: Unit;
}

export interface TextToken {
  lineHeight: number;
  size: Unit;
}

export interface DesignTokens {
  border: {
    [K in BorderSize]: BorderToken;
  };
  breakpoint: {
    [K in BreakpointSize]: BreakpointToken;
  };
  depth: {
    [K in ElevationType]: number;
  };
  heading: {
    [K in HeadingSize]: HeadingToken;
  };
  shadow: {
    [K in ShadowSize]: ShadowToken;
  };
  spacing: {
    [K in SpacingSize]: Unit;
  } & {
    type: string;
    unit: number;
  };
  text: {
    [K in TextSize]: TextToken;
  };
  typography: {
    font: {
      heading: string;
      locale: { [locale: string]: string };
      monospace: string;
      text: string;
      system: string;
    };
    rootLineHeight: number;
    rootTextSize: Unit;
  };
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
  'breakpoint-xs-root-line-height': number;
  'breakpoint-xs-root-text-size': Unit;
  'breakpoint-sm-query': string;
  'breakpoint-sm-root-line-height': number;
  'breakpoint-sm-root-text-size': Unit;
  'breakpoint-md-query': string;
  'breakpoint-md-root-line-height': number;
  'breakpoint-md-root-text-size': Unit;
  'breakpoint-lg-query': string;
  'breakpoint-lg-root-line-height': number;
  'breakpoint-lg-root-text-size': Unit;
  'breakpoint-xl-query': string;
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

export interface ThemeTokens {
  palette: {
    [K in PaletteType]: {
      color: ColorRangeToken;
      bg: ColorStateToken;
      fg: ColorStateToken;
    };
  };
}

// Keep in sync with the tokens above
export interface ThemeVariables {
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
  'palette-brand-bg-base': Hexcode;
  'palette-brand-bg-disabled': Hexcode;
  'palette-brand-bg-focused': Hexcode;
  'palette-brand-bg-hovered': Hexcode;
  'palette-brand-bg-selected': Hexcode;
  'palette-brand-fg-base': Hexcode;
  'palette-brand-fg-disabled': Hexcode;
  'palette-brand-fg-focused': Hexcode;
  'palette-brand-fg-hovered': Hexcode;
  'palette-brand-fg-selected': Hexcode;
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
  'palette-primary-bg-base': Hexcode;
  'palette-primary-bg-disabled': Hexcode;
  'palette-primary-bg-focused': Hexcode;
  'palette-primary-bg-hovered': Hexcode;
  'palette-primary-bg-selected': Hexcode;
  'palette-primary-fg-base': Hexcode;
  'palette-primary-fg-disabled': Hexcode;
  'palette-primary-fg-focused': Hexcode;
  'palette-primary-fg-hovered': Hexcode;
  'palette-primary-fg-selected': Hexcode;
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
  'palette-secondary-bg-base': Hexcode;
  'palette-secondary-bg-disabled': Hexcode;
  'palette-secondary-bg-focused': Hexcode;
  'palette-secondary-bg-hovered': Hexcode;
  'palette-secondary-bg-selected': Hexcode;
  'palette-secondary-fg-base': Hexcode;
  'palette-secondary-fg-disabled': Hexcode;
  'palette-secondary-fg-focused': Hexcode;
  'palette-secondary-fg-hovered': Hexcode;
  'palette-secondary-fg-selected': Hexcode;
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
  'palette-tertiary-bg-base': Hexcode;
  'palette-tertiary-bg-disabled': Hexcode;
  'palette-tertiary-bg-focused': Hexcode;
  'palette-tertiary-bg-hovered': Hexcode;
  'palette-tertiary-bg-selected': Hexcode;
  'palette-tertiary-fg-base': Hexcode;
  'palette-tertiary-fg-disabled': Hexcode;
  'palette-tertiary-fg-focused': Hexcode;
  'palette-tertiary-fg-hovered': Hexcode;
  'palette-tertiary-fg-selected': Hexcode;
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
  'palette-neutral-bg-base': Hexcode;
  'palette-neutral-bg-disabled': Hexcode;
  'palette-neutral-bg-focused': Hexcode;
  'palette-neutral-bg-hovered': Hexcode;
  'palette-neutral-bg-selected': Hexcode;
  'palette-neutral-fg-base': Hexcode;
  'palette-neutral-fg-disabled': Hexcode;
  'palette-neutral-fg-focused': Hexcode;
  'palette-neutral-fg-hovered': Hexcode;
  'palette-neutral-fg-selected': Hexcode;
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
  'palette-muted-bg-base': Hexcode;
  'palette-muted-bg-disabled': Hexcode;
  'palette-muted-bg-focused': Hexcode;
  'palette-muted-bg-hovered': Hexcode;
  'palette-muted-bg-selected': Hexcode;
  'palette-muted-fg-base': Hexcode;
  'palette-muted-fg-disabled': Hexcode;
  'palette-muted-fg-focused': Hexcode;
  'palette-muted-fg-hovered': Hexcode;
  'palette-muted-fg-selected': Hexcode;
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
  'palette-info-bg-base': Hexcode;
  'palette-info-bg-disabled': Hexcode;
  'palette-info-bg-focused': Hexcode;
  'palette-info-bg-hovered': Hexcode;
  'palette-info-bg-selected': Hexcode;
  'palette-info-fg-base': Hexcode;
  'palette-info-fg-disabled': Hexcode;
  'palette-info-fg-focused': Hexcode;
  'palette-info-fg-hovered': Hexcode;
  'palette-info-fg-selected': Hexcode;
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
  'palette-warning-bg-base': Hexcode;
  'palette-warning-bg-disabled': Hexcode;
  'palette-warning-bg-focused': Hexcode;
  'palette-warning-bg-hovered': Hexcode;
  'palette-warning-bg-selected': Hexcode;
  'palette-warning-fg-base': Hexcode;
  'palette-warning-fg-disabled': Hexcode;
  'palette-warning-fg-focused': Hexcode;
  'palette-warning-fg-hovered': Hexcode;
  'palette-warning-fg-selected': Hexcode;
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
  'palette-danger-bg-base': Hexcode;
  'palette-danger-bg-disabled': Hexcode;
  'palette-danger-bg-focused': Hexcode;
  'palette-danger-bg-hovered': Hexcode;
  'palette-danger-bg-selected': Hexcode;
  'palette-danger-fg-base': Hexcode;
  'palette-danger-fg-disabled': Hexcode;
  'palette-danger-fg-focused': Hexcode;
  'palette-danger-fg-hovered': Hexcode;
  'palette-danger-fg-selected': Hexcode;
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
  'palette-success-bg-base': Hexcode;
  'palette-success-bg-disabled': Hexcode;
  'palette-success-bg-focused': Hexcode;
  'palette-success-bg-hovered': Hexcode;
  'palette-success-bg-selected': Hexcode;
  'palette-success-fg-base': Hexcode;
  'palette-success-fg-disabled': Hexcode;
  'palette-success-fg-focused': Hexcode;
  'palette-success-fg-hovered': Hexcode;
  'palette-success-fg-selected': Hexcode;
}

export type Tokens = DesignTokens & ThemeTokens;

export type Variables = DesignVariables & ThemeVariables;

export type VariableName = keyof Variables;

export type VarFactory = (name: VariableName, ...fallbacks: (string | number)[]) => string;

export type UnitFactory = (...sizes: number[]) => Unit;

// MIXINS

export interface Mixins {
  border: {
    [K in BorderSize]: DeclarationBlock;
  };
  box: {
    [K in CommonSize]: DeclarationBlock;
  };
  heading: {
    [K in HeadingSize]: DeclarationBlock;
  };
  // input: {
  //   default: DeclarationBlock;
  //   disabled: DeclarationBlock;
  //   focused: DeclarationBlock;
  //   invalid: DeclarationBlock;
  // };
  pattern: {
    hidden: DeclarationBlock;
    offscreen: DeclarationBlock;
    reset: {
      button: DeclarationBlock;
      input: DeclarationBlock;
      list: DeclarationBlock;
      typography: DeclarationBlock;
    };
    text: {
      break: DeclarationBlock;
      truncate: DeclarationBlock;
      wrap: DeclarationBlock;
    };
  };
  shadow: {
    [K in ShadowSize]: DeclarationBlock;
  };
  // state: {
  //   disabled: DeclarationBlock;
  //   focused: DeclarationBlock;
  //   invalid: DeclarationBlock;
  // };
  text: {
    [K in TextSize]: DeclarationBlock;
  };
}

export type MixinName =
  | 'border-sm'
  | 'border-df'
  | 'border-lg'
  | 'box-sm'
  | 'box-df'
  | 'box-lg'
  | 'heading-l1'
  | 'heading-l2'
  | 'heading-l3'
  | 'heading-l4'
  | 'heading-l5'
  | 'heading-l6'
  | 'pattern-hidden'
  | 'pattern-offscreen'
  | 'pattern-reset-button'
  | 'pattern-reset-input'
  | 'pattern-reset-list'
  | 'pattern-reset-typography'
  | 'pattern-text-break'
  | 'pattern-text-truncate'
  | 'pattern-text-wrap'
  | 'shadow-xs'
  | 'shadow-sm'
  | 'shadow-df'
  | 'shadow-lg'
  | 'shadow-xl'
  | 'text-sm'
  | 'text-df'
  | 'text-lg';

export type MixinFactory = (
  name: MixinName | MixinName[],
  properties: DeclarationBlock,
) => DeclarationBlock;

// OTHER

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
