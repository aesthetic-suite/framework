import { DeclarationBlock } from '@aesthetic/sss';

export type Unit = string;

export type Hexcode = string;

export type CommonSize = 'sm' | 'df' | 'lg';

export type BorderSize = CommonSize;

export type BreakpointSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ColorScheme = 'dark' | 'light';

export type ContrastLevel = 'normal' | 'high' | 'low';

export type HeadingSize = 'l1' | 'l2' | 'l3' | 'l4' | 'l5' | 'l6';

export type LayerType =
  | 'hide'
  | 'auto'
  | 'base'
  | 'content'
  | 'navigation'
  | 'menu'
  | 'sheet'
  | 'overlay'
  | 'modal'
  | 'popover'
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

// TOKENS

export type UnitFactory = (...sizes: number[]) => Unit;

export interface BorderToken {
  radius: Unit;
  width: Unit;
}

export interface BreakpointToken {
  query: string;
  querySize: number;
  rootTextSize: Unit;
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
  heading: {
    [K in HeadingSize]: HeadingToken;
  };
  layer: {
    [K in LayerType]: number;
  };
  shadow: {
    [K in ShadowSize]: ShadowToken[];
  };
  spacing: {
    [K in SpacingSize]: Unit;
  };
  text: {
    [K in TextSize]: TextToken;
  };
  typography: {
    fontFamily: string;
    rootLineHeight: number;
    rootTextSize: Unit;
    systemFontFamily: string;
  };
  unit: UnitFactory;
}

export interface ThemeTokens {
  palette: unknown; // TODO
}

export type Tokens = DesignTokens & ThemeTokens;

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
  input: {
    default: DeclarationBlock;
    disabled: DeclarationBlock;
    focused: DeclarationBlock;
    invalid: DeclarationBlock;
  };
  state: {
    disabled: DeclarationBlock;
    focused: DeclarationBlock;
    invalid: DeclarationBlock;
  };
  text: {
    [K in TextSize]: DeclarationBlock;
  };
  typography: {
    break: DeclarationBlock;
    root: DeclarationBlock;
    truncate: DeclarationBlock;
    wrap: DeclarationBlock;
  };
  ui: {
    hidden: DeclarationBlock;
    hiddenOffscreen: DeclarationBlock;
    resetButton: DeclarationBlock;
    resetInput: DeclarationBlock;
    resetList: DeclarationBlock;
    resetTypography: DeclarationBlock;
  };
}

// OTHER

export interface ThemeOptions {
  contrast: ContrastLevel;
  scheme: ColorScheme;
}

export interface QueryParams {
  contrast?: ContrastLevel;
  scheme?: ColorScheme;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : DeepPartial<T[P]>;
};
