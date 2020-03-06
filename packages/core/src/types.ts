import {
  GlobalStyleSheet,
  GlobalStyleSheetNeverize,
  LocalStyleSheet,
  LocalStyleSheetNeverize,
} from '@aesthetic/sss';
import { ClassName as BaseClassName } from '@aesthetic/style';
import { ColorScheme, ContrastLevel, Tokens, ThemeName, Factories } from '@aesthetic/system';

export type Direction = 'neutral' | 'ltr' | 'rtl';

export type ClassName = BaseClassName;

export type ClassNameSheet<T extends string> = { [K in T]: ClassName };

export type StringOnly<T> = T extends string ? string : never;

export interface SheetQuery {
  contrast?: ContrastLevel;
  dir?: Direction;
  scheme?: ColorScheme;
  theme?: ThemeName;
}

export type GlobalSheetFactory<T = unknown> = (
  factories: Factories,
  tokens: Tokens,
) => T extends unknown ? GlobalStyleSheet : GlobalStyleSheet & GlobalStyleSheetNeverize<T>;

export type LocalSheetFactory<T = unknown> = (
  factories: Factories,
  tokens: Tokens,
) => T extends unknown ? LocalStyleSheet : LocalStyleSheet & LocalStyleSheetNeverize<T>;

export interface AestheticOptions {
  defaultUnit?: string;
  deterministicClasses?: boolean;
  vendorPrefixes?: boolean;
}
