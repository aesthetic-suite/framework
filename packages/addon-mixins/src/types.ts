import {
  BorderSize,
  ColorShade,
  Mixin,
  PaletteType,
  ShadowSize,
  TextSize,
} from '@aesthetic/system';

export interface BackgroundOptions {
  palette?: PaletteType;
}

export interface BorderOptions {
  palette?: PaletteType;
  radius?: boolean;
  shade?: ColorShade;
  size?: BorderSize;
}

export interface ForegroundOptions {
  palette?: PaletteType;
}

export interface HeadingOptions {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ResetButtonOptions {
  flex?: boolean;
}

export interface ShadowOptions {
  palette?: PaletteType;
  shade?: ColorShade;
  size?: ShadowSize;
}

export interface TextOptions {
  size?: TextSize;
}

export interface UIBoxOptions {
  border?: BorderOptions | boolean;
  palette?: PaletteType;
  shadow?: ShadowOptions | boolean;
}

export interface UIInteractiveOptions {
  palette?: PaletteType;
}

export type MixinType =
  | 'background'
  | 'border'
  | 'foreground'
  | 'heading'
  | 'hide-completely'
  | 'hide-offscreen'
  | 'hide-visually'
  | 'reset-button'
  | 'reset-input'
  | 'reset-list'
  | 'reset-media'
  | 'reset-typography'
  | 'root'
  | 'shadow'
  | 'text-break'
  | 'text-truncate'
  | 'text-wrap'
  | 'text'
  | 'ui-box'
  | 'ui-interactive';

declare module '@aesthetic/system' {
  export interface Mixins<T extends object> {
    background: Mixin<T, BackgroundOptions>;
    border: Mixin<T, BorderOptions>;
    foreground: Mixin<T, ForegroundOptions>;
    heading: Mixin<T, HeadingOptions>;
    hideCompletely: Mixin<T>;
    hideOffscreen: Mixin<T>;
    hideVisually: Mixin<T>;
    resetButton: Mixin<T, ResetButtonOptions>;
    resetInput: Mixin<T>;
    resetList: Mixin<T>;
    resetMedia: Mixin<T>;
    resetTypography: Mixin<T>;
    root: Mixin<T>;
    shadow: Mixin<T, ShadowOptions>;
    text: Mixin<T, TextOptions>;
    textBreak: Mixin<T>;
    textTruncate: Mixin<T>;
    textWrap: Mixin<T>;
    uiBox: Mixin<T, UIBoxOptions>;
    uiInteractive: Mixin<T, UIInteractiveOptions>;
  }
}
