import {
  GlobalStyleSheet,
  GlobalStyleSheetNeverize,
  LocalStyleSheet,
  LocalStyleSheetNeverize,
  LocalBlock,
} from '@aesthetic/sss';
import { DirectionConverter, VendorPrefixer } from '@aesthetic/style';
import { ColorScheme, ContrastLevel, Utilities } from '@aesthetic/system';
import { ClassName, ThemeName, Direction, Unit, UnitFactory } from '@aesthetic/types';
import StyleSheet from './StyleSheet';

export interface ClassNameSheetVariants {
  [value: string]: ClassName;
}

export interface ClassNameResult {
  class?: ClassName;
  variants?: ClassNameSheetVariants;
}

export type ClassNameSheet<T extends string> = {
  [K in T]?: ClassNameResult;
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

export interface SheetElementMetadata {
  classNames: ClassNameResult;
  variantTypes?: Set<string>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BaseSheetFactory = (utils: Utilities<any>) => object;

export type GlobalSheetFactory<T = unknown, R extends object = LocalBlock> = (
  utils: Utilities<R>,
) => T extends unknown ? GlobalStyleSheet : GlobalStyleSheet & GlobalStyleSheetNeverize<T>;

export type GlobalSheet<T = unknown, R extends object = LocalBlock> = Omit<
  StyleSheet<GlobalSheetFactory<T, R>, ClassName>,
  'addColorSchemeVariant' | 'addContrastVariant' | 'addThemeVariant'
>;

export type LocalSheetFactory<T = unknown, R extends object = LocalBlock> = (
  utils: Utilities<R>,
) => T extends unknown ? LocalStyleSheet : LocalStyleSheet & LocalStyleSheetNeverize<T>;

export type LocalSheet<T = unknown, R extends object = LocalBlock> = StyleSheet<
  LocalSheetFactory<T, R>,
  ClassNameSheet<string>
>;

export interface AestheticOptions {
  defaultUnit?: Unit | UnitFactory;
  deterministicClasses?: boolean;
  directionConverter?: DirectionConverter | null;
  vendorPrefixer?: VendorPrefixer | null;
}

export type EventType = 'change:direction' | 'change:theme';

export type OnChangeDirection = (newDir: Direction) => void;

export type OnChangeTheme = (newTheme: ThemeName) => void;
