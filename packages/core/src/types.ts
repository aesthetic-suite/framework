/* eslint-disable import/no-unresolved */

import {
  GlobalStyleSheet,
  GlobalStyleSheetNeverize,
  LocalStyleSheet,
  LocalStyleSheetNeverize,
} from '@aesthetic/sss';
import {
  ColorScheme,
  ContrastLevel,
  MixinFactory,
  Tokens,
  UnitFactory,
  VarFactory,
} from '@aesthetic/system';

export * from '@aesthetic/sss/lib/types';
export * from '@aesthetic/system/lib/types';

export type Direction = 'neutral' | 'ltr' | 'rtl';

export type ClassName = string;

export type ClassNameSheet<T extends string> = { [K in T]: string };

export type ThemeName = string;

export type StringOnly<T> = T extends string ? string : never;

export interface SheetParams {
  mixin: MixinFactory;
  unit: UnitFactory;
  var: VarFactory;
}

export interface SheetQuery {
  contrast?: ContrastLevel;
  dir?: Direction;
  scheme?: ColorScheme;
  theme?: ThemeName;
}

export type GlobalSheetFactory<T = unknown> = (
  params: SheetParams,
  tokens: Tokens,
) => T extends unknown ? GlobalStyleSheet : GlobalStyleSheet & GlobalStyleSheetNeverize<T>;

export type LocalSheetFactory<T = unknown> = (
  params: SheetParams,
  tokens: Tokens,
) => T extends unknown ? LocalStyleSheet : LocalStyleSheet & LocalStyleSheetNeverize<T>;
