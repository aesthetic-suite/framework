import {
  ColorScheme,
  Hexcode,
  PaletteType,
  BorderSize,
  BreakpointSize,
  HeadingSize,
  LayerType,
  ShadowSize,
  SpacingSize,
  TextSize,
  ContrastLevel,
} from '@aesthetic/system';

export type PlatformType = 'android' | 'ios' | 'web';

export type TargetType =
  | 'android'
  | 'ios'
  | 'web-css'
  | 'web-less'
  | 'web-sass'
  | 'web-scss'
  | 'web-js'
  | 'web-ts';

// CONFIG FILE
// Structure of the YAML config file. Assumes all properties are defined because of optimal.

export type ScaleType =
  | 'minor-second'
  | 'major-second'
  | 'minor-third'
  | 'major-third'
  | 'perfect-fourth'
  | 'augmented-fourth'
  | 'perfect-fifth'
  | 'minor-sixth'
  | 'major-sixth'
  | 'minor-seventh'
  | 'major-seventh'
  | 'major-tenth'
  | 'major-eleventh'
  | 'major-twelfth'
  | 'octave'
  | 'double-octave'
  | 'golden-ratio'
  | 'golden-section';

export type Scale = number | ScaleType;

export type StrategyType = 'mobile-first' | 'desktop-first';

// Borders

export interface BorderConfig {
  radius: number;
  width: number;
}

export interface BorderScaledConfig extends BorderConfig {
  radiusScale: Scale;
  widthScale: Scale;
}

export interface BorderSizedConfig {
  small: BorderConfig;
  default: BorderConfig;
  large: BorderConfig;
}

// Breakpoints

export type BreakpointListConfig = [number, number, number, number, number];

export type BreakpointSizedConfig = {
  [K in BreakpointSize]: number;
};

export type BreakpointConfig = BreakpointListConfig | BreakpointSizedConfig;

// Shadows

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

// Spacing

export type SpacingType = 'unit' | 'vertical-rhythm';

export interface SpacingConfig {
  type: SpacingType;
  unit: number;
}

// Typography

export interface FontConfig {
  text: string;
  heading: string;
  locale: { [locale: string]: string };
}

export interface ResponsiveScale {
  responsiveScale: Scale;
}

export interface TextConfig {
  lineHeight: number;
  size: number;
}

export interface TextScaledConfig extends TextConfig, ResponsiveScale {
  lineHeightScale: Scale;
  sizeScale: Scale;
}

export interface TextSizedConfig extends ResponsiveScale {
  small: TextConfig;
  default: TextConfig;
  large: TextConfig;
}

export interface HeadingConfig {
  letterSpacing: number;
  lineHeight: number;
  size: number;
}

export interface HeadingScaledConfig extends HeadingConfig, ResponsiveScale {
  letterSpacingScale: Scale;
  lineHeightScale: Scale;
  sizeScale: Scale;
}

export interface HeadingSizedConfig extends ResponsiveScale {
  level1: HeadingConfig;
  level2: HeadingConfig;
  level3: HeadingConfig;
  level4: HeadingConfig;
  level5: HeadingConfig;
  level6: HeadingConfig;
}

export interface TypographyConfig {
  font: string | FontConfig;
  text: TextScaledConfig | TextSizedConfig;
  heading: HeadingScaledConfig | HeadingSizedConfig;
}

export interface DesignConfig {
  borders: BorderScaledConfig | BorderSizedConfig;
  breakpoints: BreakpointConfig;
  colors: string[];
  // shadows: ShadowConfig | ShadowConfig[];
  spacing: SpacingConfig;
  strategy: StrategyType;
  typography: TypographyConfig;
}

// Colors

export type ColorShade = '00' | '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90';

export type ColorConfig = {
  [K in ColorShade]: Hexcode;
};

// Palettes

export interface PaletteConfigStates {
  base: string;
  disabled: string;
  focused: string;
  hovered: string;
  selected: string;
}

export type PaletteConfig = {
  [K in PaletteType]: {
    bg: PaletteConfigStates;
    fg: PaletteConfigStates;
  };
};

export interface ThemeConfig<ColorNames extends string = string> {
  colors: { [K in ColorNames]: Hexcode | ColorConfig };
  contrast: ContrastLevel;
  extends: string;
  palettes: PaletteConfig;
  scheme: ColorScheme;
}

export interface ConfigFile<ColorNames extends string = string> extends DesignConfig {
  themes: { [name: string]: ThemeConfig<ColorNames> };
}

// CONFIG FILE -> TOKENS TEMPLATE
// A rough design token template where all values are in a raw unitless state.
// This is because units are platform and target specific, so happens during compilation.

export interface BorderTemplate {
  radius: number;
  width: number;
}

export type BreakpointCondition = [string, number];

export interface BreakpointTemplate {
  queryConditions: BreakpointCondition[];
  querySize: number;
  rootTextSize: number;
}

export interface ShadowTemplate {
  blur: number;
  spread: number;
  x: number;
  y: number;
}

export interface TypographyTemplate {
  lineHeight: number;
  size: number;
}

export interface DesignTemplate {
  border: {
    [K in BorderSize]: BorderTemplate;
  };
  breakpoint: {
    [K in BreakpointSize]: BreakpointTemplate;
  };
  heading: {
    [K in HeadingSize]: TypographyTemplate;
  };
  layer: {
    [K in LayerType]: number;
  };
  shadow: {
    [K in ShadowSize]: ShadowTemplate[];
  };
  spacing: {
    [K in SpacingSize]: number; // Multiplier
  };
  text: {
    [K in TextSize]: TypographyTemplate;
  };
  typography: {
    headingFont: string;
    localeFonts: { [locale: string]: string };
    rootLineHeight: number;
    rootTextSize: number;
    systemFont: string;
    textFont: string;
  };
}

export interface ThemeTemplate extends DesignTemplate {
  palette: ThemeConfig['palettes'];
}
