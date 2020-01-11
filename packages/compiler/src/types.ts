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
  | 'golden-ratio';

export type Scale = number | ScaleType;

export type SpacingType = 'unit' | 'vertical-rhythm';

export type StrategyType = 'mobile-first' | 'desktop-first';

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

export interface DesignConfig {
  borders: BorderConfig;
  breakpoints: BreakpointConfig;
  colors: string[];
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

export type ColorShade = '00' | '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90';

export type ColorConfig = {
  [K in ColorShade]: Hexcode;
};

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
    fontFamily: string;
    rootLineHeight: number;
    rootTextSize: number;
    systemFontFamily: string;
  };
}

export interface ThemeTemplate extends DesignTemplate {
  palette: ThemeConfig['palettes'];
}
