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

declare module '@aesthetic/system' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface MixinUtil<T extends object, O extends object = object> {
    background: MixinBuiltIn<T, BackgroundOptions>;
    border: MixinBuiltIn<T, BorderOptions>;
    foreground: MixinBuiltIn<T, ForegroundOptions>;
    heading: MixinBuiltIn<T, HeadingOptions>;
    hideCompletely: MixinBuiltIn<T>;
    hideOffscreen: MixinBuiltIn<T>;
    hideVisually: MixinBuiltIn<T>;
    resetButton: MixinBuiltIn<T, ResetButtonOptions>;
    resetInput: MixinBuiltIn<T>;
    resetList: MixinBuiltIn<T>;
    resetMedia: MixinBuiltIn<T>;
    resetTypography: MixinBuiltIn<T>;
    root: MixinBuiltIn<T>;
    shadow: MixinBuiltIn<T, ShadowOptions>;
    text: MixinBuiltIn<T, TextOptions>;
    textBreak: MixinBuiltIn<T>;
    textTruncate: MixinBuiltIn<T>;
    textWrap: MixinBuiltIn<T>;
    uiBox: MixinBuiltIn<T, UIBoxOptions>;
    uiInteractive: MixinBuiltIn<T, UIInteractiveOptions>;
  }
}
