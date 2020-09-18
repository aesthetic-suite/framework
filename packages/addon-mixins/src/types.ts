import {
  BorderSize,
  ColorShade,
  MixinUtil,
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
  border?: boolean | BorderOptions;
  palette?: PaletteType;
  shadow?: boolean | ShadowOptions;
}

export interface UIInteractiveOptions {
  palette?: PaletteType;
}

declare module '@aesthetic/system' {
  export interface MixinUtils {
    background: MixinUtil<BackgroundOptions>;
    border: MixinUtil<BorderOptions>;
    foreground: MixinUtil<ForegroundOptions>;
    heading: MixinUtil<HeadingOptions>;
    hideCompletely: MixinUtil;
    hideOffscreen: MixinUtil;
    hideVisually: MixinUtil;
    resetButton: MixinUtil<ResetButtonOptions>;
    resetInput: MixinUtil;
    resetList: MixinUtil;
    resetMedia: MixinUtil;
    resetTypography: MixinUtil;
    root: MixinUtil;
    shadow: MixinUtil<ShadowOptions>;
    text: MixinUtil<TextOptions>;
    textBreak: MixinUtil;
    textTruncate: MixinUtil;
    textWrap: MixinUtil;
    uiBox: MixinUtil<UIBoxOptions>;
    uiInteractive: MixinUtil<UIInteractiveOptions>;
  }
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
  | 'text'
  | 'text-break'
  | 'text-truncate'
  | 'text-wrap'
  | 'ui-box'
  | 'ui-interactive';
