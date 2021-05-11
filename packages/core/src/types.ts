import {
  CustomProperties,
  GlobalStyleSheet,
  GlobalStyleSheetNeverize,
  LocalBlock,
  LocalStyleSheet,
  LocalStyleSheetNeverize,
  PropertyHandlerMap,
} from '@aesthetic/sss';
import { Utilities } from '@aesthetic/system';
import {
  ColorScheme,
  ContrastLevel,
  Direction,
  DirectionConverter,
  ThemeName,
  Unit,
  UnitFactory,
  VendorPrefixer,
} from '@aesthetic/types';
import StyleSheet from './StyleSheet';

// Re-export for convenience
export type { CustomProperties, GlobalStyleSheet, LocalBlock, LocalStyleSheet };

// And add aliases too
export type ElementStyles = LocalBlock;
export type ComponentStyles = LocalStyleSheet<ElementStyles>;
export type ThemeStyles = GlobalStyleSheet<ElementStyles>;

// RENDER RESULT

export interface RenderResultVariant<T> {
  match: string[];
  result: T;
}

export interface RenderResult<T> {
  result?: T;
  variants?: RenderResultVariant<T>[];
  variantTypes?: Set<string>;
}

export type RenderResultSheet<Result, Keys extends string = string> = {
  [K in Keys]?: RenderResult<Result>;
};

export type WrapFalsy<T> = T | false | null | undefined;

export type WrapArray<T> = T extends (infer I)[] ? WrapFalsy<I>[] : WrapFalsy<T>[];

export type ResultComposerArgs<K, R> = (WrapArray<R> | WrapFalsy<K>)[];

export type ResultComposerVariants = Record<string, string | undefined>;

export interface ResultComposer<K, R> {
  result: RenderResultSheet<R>;
  (variants: ResultComposerVariants, ...args: ResultComposerArgs<K, R>): R;
  (...args: ResultComposerArgs<K, R>): R;
}

export type ResultGenerator<K, R, GR = R> = (
  args: ResultComposerArgs<K, R>,
  variants: Set<string>,
  classNames: RenderResultSheet<R>,
) => GR;

// STYLE SHEETS

export interface SheetParams {
  contrast?: ContrastLevel;
  direction?: Direction;
  scheme?: ColorScheme;
  theme?: ThemeName;
  unit?: Unit;
  vendor?: boolean;
}

export interface SheetParamsExtended extends SheetParams {
  customProperties?: PropertyHandlerMap;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BaseSheetFactory = (utils: Utilities<any>) => object;

export type GlobalSheetFactory<Shape = unknown, Block extends object = LocalBlock> = (
  utils: Utilities<Block>,
) => Shape extends unknown
  ? GlobalStyleSheet<Block>
  : GlobalStyleSheet<Block> & GlobalStyleSheetNeverize<Shape, Block>;

export type GlobalSheet<Shape, Block extends object, Result> = Omit<
  StyleSheet<Result, GlobalSheetFactory<Shape, Block>>,
  'addColorSchemeOverride' | 'addContrastOverride' | 'addThemeOverride'
>;

export type LocalSheetFactory<Shape = unknown, Block extends object = LocalBlock> = (
  utils: Utilities<Block>,
) => Shape extends unknown
  ? LocalStyleSheet<Block>
  : LocalStyleSheet<Block> & LocalStyleSheetNeverize<Shape, Block>;

export type LocalSheet<Shape, Block extends object, Result> = StyleSheet<
  Result,
  LocalSheetFactory<Shape, Block>
>;

// OTHER

export interface AestheticOptions {
  customProperties?: PropertyHandlerMap;
  defaultUnit?: Unit | UnitFactory;
  deterministicClasses?: boolean;
  directionConverter?: DirectionConverter | null;
  rootVariables?: boolean;
  vendorPrefixer?: VendorPrefixer | null;
}

export type EventType = 'change:direction' | 'change:theme';

export type EventListener = (...args: unknown[]) => void;

export type OnChangeDirection = (newDir: Direction) => void;

export type OnChangeTheme = (newTheme: ThemeName, results: unknown[]) => void;
