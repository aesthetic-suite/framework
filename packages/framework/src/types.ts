/* eslint-disable no-magic-numbers */

import { DeclarationBlock } from '@aesthetic/sss';

export type PxUnit = string;

export type EmUnit = string;

export type RemUnit = string;

export type Unit = PxUnit | EmUnit | RemUnit;

export type Hexcode = string;

export type BorderSize = 'sm' | 'base' | 'lg';

export type BreakpointSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ColorScheme = 'dark' | 'light';

export type ColorShade = '00' | '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90';

export type ContrastLevel = 'normal' | 'high' | 'low';

export type HeadingSize = 1 | 2 | 3 | 4 | 5 | 6;

export type LayerType =
  | 'none'
  | 'content'
  | 'navigation'
  | 'menu'
  | 'sheet'
  | 'modal'
  | 'toast'
  | 'tooltip';

export type PaletteType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'neutral'
  | 'muted'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info';

export type ScaleType =
  | 'minor-second'
  | 'major-second'
  | 'minor-third'
  | 'major-third'
  | 'perfect-fourth'
  | 'augmented-fourth'
  | 'perfect-fifth'
  | 'golden-ratio';

export type Scale = number | ScaleType;

export type StrategyType = 'mobile-first' | 'desktop-first';

export type ShadowSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SpacingSize = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl';

export type SpacingType = 'unit' | 'vertical-rhythm';

export type TextSize = 'sm' | 'base' | 'lg';

export type FontFamilyType = 'web-system';

// DESIGN CONFIG

export interface BorderConfig {
  radius: number;
  radiusScale: Scale;
  width: number;
  widthScale: Scale;
}

export type BreakpointConfig = [number, number, number, number, number];

export interface ShadowConfig {
  blur: number;
  blurScale: Scale;
  spread: number;
  spreadScale: Scale;
  x: number;
  xScale: Scale;
  y: number;
  yScale: Scale;
}

export interface SpacingConfig {
  type: SpacingType;
  unit: number;
}

export interface TypographyConfig {
  lineHeight: number;
  lineHeightScale: Scale;
  size: number;
  sizeScale: Scale;
}

export interface DesignConfig<ColorNames extends string> {
  borders: BorderConfig;
  breakpoints: BreakpointConfig;
  colors: ColorNames[];
  shadows: ShadowConfig | ShadowConfig[];
  spacing: SpacingConfig;
  strategy: StrategyType;
  typography: {
    fontFamily: string;
    heading: TypographyConfig;
    text: TypographyConfig;
    responsiveScale: Scale;
  };
}

// THEME CONFIG

export type ColorConfig = {
  [K in ColorShade]: Hexcode;
};

export interface PaletteConfigStates<T = string> {
  base: T;
  disabled: T;
  focused: T;
  hovered: T;
  selected: T;
}

export type PaletteConfig<T = string> = {
  [K in PaletteType]: {
    bg: PaletteConfigStates<T>;
    fg: PaletteConfigStates<T>;
  };
};

export interface ThemeConfig<ColorNames extends string> {
  colors: { [K in ColorNames]: Hexcode | ColorConfig };
  contrast: ContrastLevel;
  palettes: PaletteConfig;
  scheme: ColorScheme;
}

// TOKENS

export type UnitFactory = (...sizes: number[]) => string;

export interface BorderToken {
  radius: PxUnit;
  width: PxUnit;
}

export interface BreakpointToken {
  query: string;
  rootTextSize: PxUnit;
  size: number;
}

export interface ShadowToken {
  blur: PxUnit;
  spread: PxUnit;
  x: PxUnit;
  y: PxUnit;
}

export interface DesignTokens {
  border: {
    [K in BorderSize]: BorderToken;
  };
  breakpoint: {
    [K in BreakpointSize]: BreakpointToken;
  };
  heading: {
    [K in HeadingSize]: RemUnit;
  };
  layer: {
    [K in LayerType]: number;
  };
  shadow: {
    [K in ShadowSize]: ShadowToken[];
  };
  spacing: {
    [K in SpacingSize]: RemUnit;
  };
  text: {
    [K in TextSize]: RemUnit;
  };
  typography: {
    fontFamily: string;
    rootLineHeight: number;
    rootTextSize: PxUnit;
    systemFontFamily: string;
  };
  unit: UnitFactory;
}

export interface ThemeTokens extends DesignTokens {
  palette: PaletteConfig<Hexcode>;
}

// MIXINS

export type MixinType =
  | 'border'
  | 'borderLarge'
  | 'borderSmall'
  | 'box'
  | 'boxLarge'
  | 'boxSmall'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'hidden'
  | 'hiddenOffscreen'
  | 'input'
  | 'inputDisabled'
  | 'inputFocused'
  | 'inputInvalid'
  | 'resetButton'
  | 'resetList'
  | 'resetText'
  | 'root'
  | 'rootBody'
  | 'rootHtml'
  | 'shadowXsmall'
  | 'shadowSmall'
  | 'shadowMedium'
  | 'shadowLarge'
  | 'shadowXlarge'
  | 'stateDisabled'
  | 'stateFocused'
  | 'stateSelected'
  | 'text'
  | 'textLarge'
  | 'textSmall';

export type ThemeMixins = {
  [K in MixinType]: DeclarationBlock;
};

// UTILS

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : DeepPartial<T[P]>;
};
