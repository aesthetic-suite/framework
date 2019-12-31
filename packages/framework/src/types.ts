/* eslint-disable no-magic-numbers */

import { DeclarationBlock } from '@aesthetic/sss';

export type PxUnit = string;

export type EmUnit = string;

export type RemUnit = string;

export type Unit = PxUnit | EmUnit | RemUnit;

export type Hexcode = string;

export type BorderSize = 'small' | 'normal' | 'large';

export type BreakpointSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export type ColorScheme = 'dark' | 'light';

export type ColorShade = '00' | '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90';

export type HeadingSize = 1 | 2 | 3 | 4 | 5 | 6;

export type LayerType = 'content' | 'navigation' | 'menu' | 'sheet' | 'modal' | 'toast' | 'tooltip';

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

export type ShadowSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type SpacingSize = 'compact' | 'tight' | 'normal' | 'loose' | 'spacious';

export type SpacingType = 'unit' | 'vertical-rhythm';

export type TextSize = 'small' | 'normal' | 'large';

// CONFIG

export type ColorConfig = {
  [K in ColorShade]: Hexcode;
};

export interface PaletteStates<T = string> {
  base: T;
  disabled: T;
  focused: T;
  hovered: T;
  selected: T;
}

export type PaletteConfig<T = string> = {
  [K in PaletteType]: {
    bg: PaletteStates<T>;
    fg: PaletteStates<T>;
  };
};

export interface ThemeConfig {
  colors: { [name: string]: ColorConfig };
  extends: string;
  palettes: PaletteConfig;
  scheme: ColorScheme;
}

export type ExtendableThemeConfig = Pick<ThemeConfig, 'colors' | 'palettes'>;

export interface DesignConfig {
  border: {
    radius: number;
    radiusScale: Scale;
    width: number;
    widthScale: Scale;
  };
  breakpoints: [number, number, number, number, number];
  colors: string[];
  shadow: {
    blur: number;
    blurScale: Scale;
    depth: number;
    depthScale: Scale;
    spread: number;
    spreadScale: Scale;
  };
  spacing: {
    type: SpacingType;
    unit: number;
  };
  strategy: StrategyType;
  typography: {
    fontFamily: string;
    fontSize: number;
    headingScale: Scale;
    lineHeight: number;
    responsiveScale: Scale;
    textScale: Scale;
  };
}

export type UnitFactory = (...sizes: number[]) => string;

export interface DesignTokens {
  border: {
    [K in BorderSize]: {
      radius: PxUnit;
      width: PxUnit;
    };
  };
  breakpoint: {
    [K in BreakpointSize]: {
      size: number;
      query: string;
    };
  };
  heading: {
    [K in HeadingSize]: RemUnit;
  };
  layer: {
    [K in LayerType]: number;
  };
  shadow: {
    [K in HeadingSize]: {
      blur: PxUnit;
      depth: PxUnit;
      spread: PxUnit;
    };
  };
  spacing: {
    [K in SpacingSize]: RemUnit;
  };
  text: {
    [K in TextSize]: RemUnit;
  };
  typography: {
    fontFamily: string;
    lineHeight: number;
    responsiveFontSizes: PxUnit[];
    rootFontSize: PxUnit;
    systemFontFamily: string;
  };
  unit: UnitFactory;
}

// THEMES

export interface ThemeTokens extends DesignTokens {
  palette: PaletteConfig<Hexcode>;
}

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
  | 'shadow1'
  | 'shadow2'
  | 'shadow3'
  | 'shadow4'
  | 'shadow5'
  | 'stateDisabled'
  | 'stateFocused'
  | 'stateSelected'
  | 'text'
  | 'textLarge'
  | 'textSmall';

export type ThemeMixins = {
  [K in MixinType]: DeclarationBlock;
};
