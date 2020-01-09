/* eslint-disable no-magic-numbers */

import { DeclarationBlock } from '@aesthetic/sss';

export type Unit = string;

export type Hexcode = string;

export type BorderSize = 'sm' | 'base' | 'lg';

export type BreakpointSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ColorScheme = 'dark' | 'light';

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

export type ShadowSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SpacingSize = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl';

export type TextSize = 'sm' | 'base' | 'lg';

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

export interface TypographyToken {
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
    [K in HeadingSize]: TypographyToken;
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
    [K in TextSize]: TypographyToken;
  };
  typography: {
    fontFamily: string;
    rootLineHeight: number;
    rootTextSize: Unit;
    systemFontFamily: string;
  };
  unit: UnitFactory;
}

export interface ThemeTokens extends DesignTokens {
  palette: unknown; // TODO
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
