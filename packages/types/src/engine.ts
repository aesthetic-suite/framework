/* eslint-disable no-use-before-define */

import {
  CSS,
  FontFace,
  Import,
  Keyframes,
  Properties,
  Property,
  Rule,
  Unit,
  UnitFactory,
  Value,
  VariablesMap,
} from './css';
import { ClassName, ColorScheme, ContrastLevel, Direction } from './ui';

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

export type SheetType = 'conditions' | 'global' | 'standard';

export type SheetMap = Record<SheetType, Sheet>;

export interface SheetManager {
  sheets: SheetMap;
  insertRule: (rule: CSS, options: RenderOptions, index?: number) => number;
}

// VENDOR PREFIXES

export interface VendorPrefixer {
  prefix: (property: string, value: string) => Record<string, string>;
  prefixSelector: (selector: string, rule: CSS) => CSS;
}

// STYLE ENGINE

export type RankCache = Record<string, number>;

export interface RenderOptions {
  className?: ClassName;
  deterministic?: boolean;
  direction?: Direction;
  media?: string;
  rankings?: RankCache;
  selector?: string;
  supports?: string;
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
  readonly atomic: boolean;
  cacheManager?: CacheManager;
  direction: Direction;
  directionConverter?: DirectionConverter;
  ruleIndex: number;
  sheetManager?: SheetManager;
  unitSuffixer?: Unit | UnitFactory;
  vendorPrefixer?: VendorPrefixer;

  prefersColorScheme: (scheme: ColorScheme) => boolean;
  prefersContrastLevel: (level: ContrastLevel) => boolean;

  renderDeclaration: <K extends Property>(
    property: K,
    value: Properties[K],
    options?: RenderOptions,
  ) => T;
  renderFontFace: (fontFace: FontFace, options?: RenderOptions) => string;
  renderImport: (path: Import | string, options?: RenderOptions) => string;
  renderKeyframes: (
    keyframes: Keyframes,
    animationName?: string,
    options?: RenderOptions,
  ) => string;
  renderRule: (rule: Rule, options?: RenderOptions) => T;
  renderRuleGrouped: (rule: Rule, options?: RenderOptions) => T;
  renderVariable: (name: string, value: Value, options?: RenderOptions) => T;

  setDirection: (direction: Direction) => void;
  setRootVariables: (variables: VariablesMap) => void;
  setTheme: (results: T[]) => void;
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
