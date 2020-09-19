import {
  BorderSize,
  ColorShade,
  MixinBuiltIn,
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
  export interface MixinUtil {
    background: MixinBuiltIn<BackgroundOptions>;
    border: MixinBuiltIn<BorderOptions>;
    foreground: MixinBuiltIn<ForegroundOptions>;
    heading: MixinBuiltIn<HeadingOptions>;
    hideCompletely: MixinBuiltIn;
    hideOffscreen: MixinBuiltIn;
    hideVisually: MixinBuiltIn;
    resetButton: MixinBuiltIn<ResetButtonOptions>;
    resetInput: MixinBuiltIn;
    resetList: MixinBuiltIn;
    resetMedia: MixinBuiltIn;
    resetTypography: MixinBuiltIn;
    root: MixinBuiltIn;
    shadow: MixinBuiltIn<ShadowOptions>;
    text: MixinBuiltIn<TextOptions>;
    textBreak: MixinBuiltIn;
    textTruncate: MixinBuiltIn;
    textWrap: MixinBuiltIn;
    uiBox: MixinBuiltIn<UIBoxOptions>;
    uiInteractive: MixinBuiltIn<UIInteractiveOptions>;
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
