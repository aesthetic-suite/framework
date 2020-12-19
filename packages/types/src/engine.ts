/* eslint-disable no-use-before-define */

import {
  CSS,
  FontFace,
  Keyframes,
  Property,
  Properties,
  Rule,
  Unit,
  UnitFactory,
  Value,
  ValueWithFallbacks,
  VariablesMap,
} from './css';
import { ClassName, Direction } from './ui';

// CACHE

export interface CacheItem {
  className: string;
  rank?: number;
}

export type CacheState = Record<string, CacheItem[]>;

export interface CacheManager {
  read: (key: string, minimumRank?: number) => CacheItem | null;
  write: (key: string, item: CacheItem) => void;
}

// DIRECTION

export interface DirectionConverter {
  convert: <T extends Value>(
    from: Direction,
    to: Direction,
    property: string,
    value: T,
  ) => { property: string; value: T };
}

// STYLE SHEETS

export interface Sheet {
  conditionText?: string;
  cssRules: Sheet[];
  cssText: CSS;
  cssVariables: VariablesMap<string>;
  textContent: CSS;
  type: number;
  insertRule: (rule: CSS, index: number) => number;
}

export type SheetType = 'global' | 'standard' | 'conditions';

export type SheetMap = Record<SheetType, Sheet>;

export interface SheetManager {
  sheets: SheetMap;
  insertRule: (rule: CSS, options: RenderOptions, index?: number) => number;
}

// VENDOR PREFIXES

export interface VendorPrefixer {
  prefix: (property: string, value: string) => Record<string, string>;
  prefixSelectors: (selectors: string[], rule: CSS) => CSS;
}

// STYLE ENGINE

export type RankCache = Record<string, number>;

export interface RenderOptions {
  className?: ClassName;
  conditions?: string[];
  deterministic?: boolean;
  direction?: Direction;
  rankings?: RankCache;
  selectors?: string[];
  type?: SheetType;
  unit?: Unit;
  vendor?: boolean;
}

export interface EngineOptions {
  cacheManager?: CacheManager;
  direction?: Direction;
  directionConverter?: DirectionConverter;
  sheetManager: SheetManager;
  unitSuffixer?: Unit | UnitFactory;
  vendorPrefixer?: VendorPrefixer;
}

export interface Engine<T> {
  cacheManager: CacheManager;
  direction: Direction;
  directionConverter?: DirectionConverter;
  ruleIndex: number;
  sheetManager: SheetManager;
  unitSuffixer?: Unit | UnitFactory;
  vendorPrefixer?: VendorPrefixer;

  renderDeclaration: <K extends Property>(
    property: K,
    value: NonNullable<Properties[K]> | ValueWithFallbacks,
    options?: RenderOptions,
  ) => T;
  renderFontFace: (fontFace: FontFace, options?: RenderOptions) => string;
  renderImport: (path: string, options?: RenderOptions) => string;
  renderKeyframes: (
    keyframes: Keyframes,
    animationName?: string,
    options?: RenderOptions,
  ) => string;
  renderRule: (rule: Rule, options?: RenderOptions) => T;
  renderRuleGrouped: (rule: Rule, options?: RenderOptions) => T;
  renderVariable: (name: string, value: Value, options?: RenderOptions) => T;
  setRootVariables: (variables: VariablesMap) => void;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AESTHETIC_CUSTOM_ENGINE: Engine<any>;
    }
  }
}
