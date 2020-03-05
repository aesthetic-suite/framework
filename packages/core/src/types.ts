/* eslint-disable import/no-unresolved */

import {
  GlobalStyleSheet,
  GlobalStyleSheetNeverize,
  LocalStyleSheet,
  LocalStyleSheetNeverize,
} from '@aesthetic/sss';
import { ColorScheme, ContrastLevel, Tokens, ThemeName, Factories } from '@aesthetic/system';

export * from '@aesthetic/sss/lib/types';
export * from '@aesthetic/system/lib/types';

export type Direction = 'neutral' | 'ltr' | 'rtl';

export type ClassName = string;

export type ClassNameSheet<T extends string> = { [K in T]: string };

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
