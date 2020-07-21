import {
  GlobalStyleSheet,
  GlobalStyleSheetNeverize,
  LocalStyleSheet,
  LocalStyleSheetNeverize,
  LocalBlock,
} from '@aesthetic/sss';
import { ColorScheme, ContrastLevel, Tokens, Utilities } from '@aesthetic/system';
import { ClassName, ThemeName, Direction, Unit, UnitFactory } from '@aesthetic/types';

export interface ClassNameSheetVariants {
  [value: string]: ClassName;
}

export type ClassNameSheet<T extends string> = {
  [K in T]?: {
    class?: ClassName;
    variants?: ClassNameSheetVariants;
  };
};

export type StringOnly<T> = T extends string ? string : never;

export interface SheetParams {
  contrast?: ContrastLevel;
  direction?: Direction;
  scheme?: ColorScheme;
  theme?: ThemeName;
  unit?: Unit | UnitFactory;
  vendor?: boolean;
}

export type SheetStructure<T extends string> = {
  [K in T]: string | object;
};

export type GlobalSheetFactory<T = unknown> = (
  utils: Utilities<LocalBlock>,
  tokens: Tokens,
) => T extends unknown ? GlobalStyleSheet : GlobalStyleSheet & GlobalStyleSheetNeverize<T>;

export type LocalSheetFactory<T = unknown> = (
  utils: Utilities<LocalBlock>,
  tokens: Tokens,
) => T extends unknown ? LocalStyleSheet : LocalStyleSheet & LocalStyleSheetNeverize<T>;

export interface AestheticOptions {
  defaultUnit?: Unit | UnitFactory;
  deterministicClasses?: boolean;
  vendorPrefixes?: boolean;
}

export type EventType = 'change:direction' | 'change:theme';

export type OnChangeDirection = (newDir: Direction) => void;

export type OnChangeTheme = (newTheme: ThemeName) => void;
