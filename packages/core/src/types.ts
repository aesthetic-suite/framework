import {
  GlobalStyleSheet,
  GlobalStyleSheetNeverize,
  LocalStyleSheet,
  LocalStyleSheetNeverize,
  LocalBlock,
} from '@aesthetic/sss';
import { DirectionConverter, VendorPrefixer } from '@aesthetic/style';
import { ColorScheme, ContrastLevel, Tokens, Utilities } from '@aesthetic/system';
import { ClassName, ThemeName, Direction, Unit, UnitFactory } from '@aesthetic/types';
import StyleSheet from './StyleSheet';

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

export type SheetType = 'local' | 'global';

export type SheetStructure<T extends string> = {
  [K in T]: string | object;
};

export type BaseSheetFactory = (utils: Utilities, tokens: Tokens) => object;

export type GlobalSheetFactory<T = unknown> = (
  utils: Utilities,
  tokens: Tokens,
) => T extends unknown ? GlobalStyleSheet : GlobalStyleSheet & GlobalStyleSheetNeverize<T>;

export type GlobalSheet<T = unknown> = Omit<
  StyleSheet<GlobalSheetFactory<T>, ClassName>,
  'addColorSchemeVariant' | 'addContrastVariant' | 'addThemeVariant'
>;

export type LocalSheetFactory<T = unknown> = (
  utils: Utilities,
  tokens: Tokens,
) => T extends unknown ? LocalStyleSheet : LocalStyleSheet & LocalStyleSheetNeverize<T>;

export type LocalSheet<T = unknown> = StyleSheet<LocalSheetFactory<T>, ClassNameSheet<string>>;

export interface AestheticOptions {
  defaultUnit?: Unit | UnitFactory;
  deterministicClasses?: boolean;
  directionConverter?: DirectionConverter | null;
  vendorPrefixer?: VendorPrefixer | null;
}

export type EventType = 'change:direction' | 'change:theme';

export type OnChangeDirection = (newDir: Direction) => void;

export type OnChangeTheme = (newTheme: ThemeName) => void;

// ALIASES

export type CSSDeclaration = LocalBlock;

export type DeclarationBlock = LocalBlock;
