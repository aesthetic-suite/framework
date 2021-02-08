import {
  BorderSize,
  BreakpointSize,
  ColorShade,
  ElevationType,
  HeadingSize,
  Hexcode,
  PaletteType,
  ShadowSize,
  SpacingSize,
  StateType,
  TextSize,
} from '@aesthetic/system';
import { ColorScheme, ContrastLevel } from '@aesthetic/types';

export type PlatformType = 'android' | 'ios' | 'web';

export type FormatType =
  | 'android'
  | 'ios'
  | 'web-css'
  | 'web-js'
  | 'web-jsx'
  | 'web-less'
  | 'web-sass'
  | 'web-scss'
  | 'web-ts'
  | 'web-tsx';

export interface SystemOptions {
  format: FormatType;
  mixins?: boolean;
  platform: PlatformType;
}

// CONFIG FILE
// Structure of the YAML config file. Assumes all properties are defined because of optimal.

export type ScaleType =
  | 'augmented-fourth'
  | 'double-octave'
  | 'golden-ratio'
  | 'golden-section'
  | 'major-eleventh'
  | 'major-second'
  | 'major-seventh'
  | 'major-sixth'
  | 'major-tenth'
  | 'major-third'
  | 'major-twelfth'
  | 'minor-second'
  | 'minor-seventh'
  | 'minor-sixth'
  | 'minor-third'
  | 'octave'
  | 'perfect-fifth'
  | 'perfect-fourth';

export type Scale = ScaleType | number;

// Borders

export interface BaseBorderConfig {
  radius: number;
  width: number;
}

export interface BorderScaledConfig extends BaseBorderConfig {
  radiusScale: Scale;
  widthScale: Scale;
}

export interface BorderSizedConfig {
  small: BaseBorderConfig;
  default: BaseBorderConfig;
  large: BaseBorderConfig;
}

export type BorderConfig = BorderScaledConfig | BorderSizedConfig;

// Responsive

export type BreakpointListConfig = [number, number, number, number, number];

export type BreakpointSizedConfig = {
  [K in BreakpointSize]: number;
};

export type BreakpointConfig = BreakpointListConfig | BreakpointSizedConfig;

export interface ResponsiveConfig {
  breakpoints: BreakpointConfig;
  lineHeightScale: Scale;
  textScale: Scale;
}

// Elevation

export interface BaseShadowConfig {
  blur: number;
  spread: number;
  x: number;
  y: number;
}

export interface ShadowScaledConfig extends BaseShadowConfig {
  blurScale: Scale;
  spreadScale: Scale;
  xScale: Scale;
  yScale: Scale;
}

export interface ShadowSizedConfig {
  xsmall: BaseShadowConfig;
  small: BaseShadowConfig;
  medium: BaseShadowConfig;
  large: BaseShadowConfig;
  xlarge: BaseShadowConfig;
}

export type ShadowConfig = ShadowScaledConfig | ShadowSizedConfig;

// Spacing

export type SpacingType = 'unit' | 'vertical-rhythm';

export interface SpacingConfig {
  multipliers: { [K in SpacingSize]: number };
  type: SpacingType;
  unit: number;
}

// Typography

export interface FontConfig {
  text: string;
  heading: string;
  locale: { [locale: string]: string };
  monospace: string;
}

export interface BaseTextConfig {
  lineHeight: number;
  size: number;
}

export interface TextScaledConfig extends BaseTextConfig {
  lineHeightScale: Scale;
  sizeScale: Scale;
}

export interface TextSizedConfig {
  small: BaseTextConfig;
  default: BaseTextConfig;
  large: BaseTextConfig;
}

export interface BaseHeadingConfig {
  letterSpacing: number;
  lineHeight: number;
  size: number;
}

export interface HeadingScaledConfig extends BaseHeadingConfig {
  letterSpacingScale: Scale;
  lineHeightScale: Scale;
  sizeScale: Scale;
}

export interface HeadingSizedConfig {
  level1: BaseHeadingConfig;
  level2: BaseHeadingConfig;
  level3: BaseHeadingConfig;
  level4: BaseHeadingConfig;
  level5: BaseHeadingConfig;
  level6: BaseHeadingConfig;
}

export interface TypographyConfig {
  font: FontConfig | string | 'system';
  text: TextScaledConfig | TextSizedConfig;
  heading: HeadingScaledConfig | HeadingSizedConfig;
}

export interface DesignConfig {
  borders: BorderConfig;
  colors: string[];
  responsive: ResponsiveConfig;
  shadows: ShadowConfig;
  spacing: SpacingConfig;
  typography: TypographyConfig;
}

// Colors

export type ColorName = string;

export type ColorShadeRef = ColorName | string;

export type ColorConfig = Record<ColorShade, Hexcode>;

export type ColorConfigMap<K extends string = string> = Record<K, ColorConfig>;

export type PaletteState<T> = Record<StateType, T> & {
  base: T;
};

export interface PaletteConfig {
  color: ColorName;
  text: ColorName | ColorShadeRef;
  bg: ColorName | PaletteState<ColorShadeRef>;
  fg: ColorName | PaletteState<ColorShadeRef>;
}

export type PalettesConfig = {
  [K in PaletteType]: ColorName | PaletteConfig;
};

// Themes

export interface ThemeConfig<ColorNames extends string = string> {
  colors: ColorConfigMap<ColorNames>;
  contrast: ContrastLevel;
  extends: string;
  palettes: PalettesConfig;
  scheme: ColorScheme;
}

// Final

export interface ConfigFile {
  extends: string;
}

export interface BrandConfigFile extends ConfigFile {
  name: string;
}

export interface LanguageConfigFile extends DesignConfig, ConfigFile {}

export interface ThemesConfigFile<ColorNames extends string = string> extends ConfigFile {
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
  rootLineHeight: number;
  rootTextSize: number;
}

export interface ShadowTemplate {
  blur: number;
  spread: number;
  x: number;
  y: number;
}

export interface TypographyTemplate {
  letterSpacing?: number;
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
  depth: {
    [K in ElevationType]: number;
  };
  heading: {
    [K in HeadingSize]: TypographyTemplate;
  };
  shadow: {
    [K in ShadowSize]: ShadowTemplate;
  };
  spacing: {
    [K in SpacingSize]: number; // Multiplier
  } & {
    type: SpacingType;
    unit: number;
  };
  text: {
    [K in TextSize]: TypographyTemplate;
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
    rootTextSize: number;
  };
}

export interface PaletteTemplate {
  color: ColorConfig;
  text: Hexcode;
  bg: PaletteState<Hexcode>;
  fg: PaletteState<Hexcode>;
}

export interface ThemeTemplate {
  palette: { [K in PaletteType]: PaletteTemplate };
}
