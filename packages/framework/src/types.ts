/* eslint-disable no-magic-numbers */

import { DeclarationBlock } from '@aesthetic/sss';

export type PxUnit = string;

export type EmUnit = string;

export type RemUnit = string;

export type Unit = PxUnit | EmUnit | RemUnit;

export type Hexcode = string;

// CONFIG

export type ColorShade = '00' | '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90';

export type ColorConfig = {
  [K in ColorShade]: Hexcode;
};

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
  scheme: 'light' | 'dark';
}

export interface Config {
  border: {
    radius: number;
    radiusScale: number;
    width: number;
    widthScale: number;
  };
  breakpoints: [number, number, number, number, number];
  colors: string[];
  shadow: {
    blur: number;
    blurScale: number;
    depth: number;
    depthScale: number;
    spread: number;
    spreadScale: number;
  };
  spacing: {
    type: 'unit' | 'vertical-rhythm';
    unit: number;
  };
  strategy: 'mobile-first' | 'desktop-first';
  themes: { [name: string]: ThemeConfig };
  typography: {
    fontFamily: string;
    fontSize: number;
    headingScale: number;
    lineHeight: number;
    responsiveScale: number;
    textScale: number;
  };
}

// THEMES

export type BorderSize = 'small' | 'normal' | 'large';

export type BreakpointSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export type HeadingSize = 1 | 2 | 3 | 4 | 5 | 6;

export type LayerType = 'content' | 'navigation' | 'menu' | 'sheet' | 'modal' | 'toast' | 'tooltip';

export type ShadowSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type SpacingSize = 'compact' | 'tight' | 'normal' | 'loose' | 'spacious';

export type SpacingHandler = (...sizes: number[]) => Unit;

export type TextSize = 'small' | 'normal' | 'large';

export interface ThemeTokens {
  border: {
    [K in BorderSize]: {
      radius: PxUnit;
      width: PxUnit;
    };
  };
  breakpoint: {
    [K in BreakpointSize]: {
      size: PxUnit;
      query: string;
    };
  };
  heading: {
    [K in HeadingSize]: RemUnit;
  };
  layer: {
    [K in LayerType]: number;
  };
  palette: PaletteConfig<Hexcode>;
  shadow: {
    [K in HeadingSize]: {
      blur: PxUnit;
      depth: PxUnit;
      spread: PxUnit;
    };
  };
  spacing: {
    [K in SpacingSize]: RemUnit;
  } &
    SpacingHandler;
  text: {
    [K in TextSize]: RemUnit;
  };
  typography: {
    fontFamily: string;
    lineHeight: number;
    systemFontFamily: string;
  };
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
