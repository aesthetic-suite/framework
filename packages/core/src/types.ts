import { Utilities } from '@aesthetic/system';
import {
  ColorScheme,
  ContrastLevel,
  Direction,
  DirectionConverter,
  PropertyHandlerMap,
  RenderResult,
  Rule,
  ThemeName,
  ThemeRule,
  Unit,
  UnitFactory,
  VendorPrefixer,
} from '@aesthetic/types';
import StyleSheet from './StyleSheet';

// RENDER RESULT

export interface StyleRenderResult<T> extends Partial<RenderResult<T>> {
  variantTypes?: Set<string>;
}

export type RenderResultSheet<Result, Keys extends string = string> = {
  [K in Keys]?: StyleRenderResult<Result>;
};

export type WrapFalsy<T> = T | false | null | undefined;

export type WrapArray<T> = T extends (infer I)[] ? WrapFalsy<I>[] : WrapFalsy<T>[];

export type ResultComposerArgs<Keys, Result> = (WrapArray<Result> | WrapFalsy<Keys>)[];

export type ResultComposerVariants = Record<string, number | string | false | undefined>;

// API consumers interact with (cx, etc)
export interface ResultComposer<Keys, Result, GeneratedResult = Result> {
  result: RenderResultSheet<Result>;
  (variants: ResultComposerVariants, ...args: ResultComposerArgs<Keys, Result>): GeneratedResult;
  (...args: ResultComposerArgs<Keys, Result>): GeneratedResult;
}

// Called from the composer to generate a final result
export type ResultGenerator<Keys, Result, GeneratedResult = Result> = (
  args: ResultComposerArgs<Keys, Result>,
  variants: Set<string>,
  results: RenderResultSheet<Result>,
) => GeneratedResult;

// STYLE SHEETS

export interface SheetParams {
  contrast?: ContrastLevel;
  direction?: Direction;
  scheme?: ColorScheme;
  theme?: ThemeName;
  unit?: Unit;
  vendor?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BaseSheetFactory = (utils: Utilities<any>) => object;

export type GlobalStyleSheet<B> = ThemeRule<B>;

export type GlobalStyleSheetNeverize<T, B> = {
  [K in keyof T]: K extends keyof GlobalStyleSheet<B> ? GlobalStyleSheet<B>[K] : never;
};

export type GlobalSheetFactory<Shape = unknown, Block extends object = Rule> = (
  utils: Utilities<Block>,
) => Shape extends unknown
  ? GlobalStyleSheet<Block>
  : GlobalStyleSheet<Block> & GlobalStyleSheetNeverize<Shape, Block>;

export type GlobalSheet<Shape, Block extends object, Result> = Omit<
  StyleSheet<Result, GlobalSheetFactory<Shape, Block>>,
  'addColorSchemeOverride' | 'addContrastOverride' | 'addThemeOverride'
>;

export type LocalStyleSheet<Block extends object = Rule> = Record<string, Block | string>;

export type LocalStyleSheetElementNeverize<T, B> = {
  [K in keyof T]: K extends keyof B ? T[K] : never;
};

export type LocalStyleSheetNeverize<T, B> = {
  [K in keyof T]: T[K] extends string ? string : LocalStyleSheetElementNeverize<T[K], B>;
};

export type LocalSheetElementFactory<Block extends object> = (utils: Utilities<Block>) => Block;

export type LocalSheetFactory<Shape = unknown, Block extends object = Rule> = (
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

// And add aliases too
export type ElementStyles = Rule;
export type ComponentStyles = LocalStyleSheet<ElementStyles>;
export type ThemeStyles = GlobalStyleSheet<ElementStyles>;
