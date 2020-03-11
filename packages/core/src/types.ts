import {
  GlobalStyleSheet,
  GlobalStyleSheetNeverize,
  LocalStyleSheet,
  LocalStyleSheetNeverize,
  LocalBlock,
} from '@aesthetic/sss';
import { ClassName as BaseClassName } from '@aesthetic/style';
import { ColorScheme, ContrastLevel, Tokens, ThemeName, Utilities, Unit } from '@aesthetic/system';

export type Direction = 'neutral' | 'ltr' | 'rtl';

export type ClassName = BaseClassName;

export type ClassNameSheet<T extends string> = { [K in T]?: ClassName };

export type StringOnly<T> = T extends string ? string : never;

export interface SheetParams {
  contrast?: ContrastLevel;
  direction?: Direction;
  prefix?: boolean;
  scheme?: ColorScheme;
  theme?: ThemeName;
  unit?: Unit;
}

export type GlobalSheetFactory<T = unknown> = (
  utils: Utilities<LocalBlock>,
  tokens: Tokens,
) => T extends unknown ? GlobalStyleSheet : GlobalStyleSheet & GlobalStyleSheetNeverize<T>;

export type LocalSheetFactory<T = unknown> = (
  utils: Utilities<LocalBlock>,
  tokens: Tokens,
) => T extends unknown ? LocalStyleSheet : LocalStyleSheet & LocalStyleSheetNeverize<T>;

export interface AestheticOptions {
  defaultUnit?: Unit;
  deterministicClasses?: boolean;
  vendorPrefixes?: boolean;
}

export type EventType = 'change:theme';

export type OnChangeTheme = (newTheme: ThemeName) => void;
