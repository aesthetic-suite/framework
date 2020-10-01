import {
  ClassName,
  CSS,
  Direction,
  FontFace,
  Keyframes,
  Properties,
  Property,
  Rule,
  Unit,
  UnitFactory,
  Value,
  ValueWithFallbacks,
  Variables,
} from '@aesthetic/types';

export type Condition = string;

export type RankCache = Record<string, number>;

export interface ProcessOptions {
  deterministic?: boolean;
  direction?: Direction;
  rankings?: RankCache;
  type?: SheetType;
  unit?: Unit | UnitFactory;
  vendor?: boolean;
}

export interface RenderOptions extends ProcessOptions {
  className?: ClassName;
  conditions?: Condition[];
  selector?: string;
}

// CACHE

export interface CacheItem {
  className: string;
  rank?: number;
}

export type CacheStorage = Record<string, CacheItem[]>;

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

export interface StyleRule {
  conditionText?: string;
  cssRules: StyleRule[];
  cssText: CSS;
  cssVariables: Variables<string>;
  textContent: CSS;
  type: number;
  insertRule: (rule: CSS, index: number) => number;
}

export type SheetType = 'global' | 'standard' | 'conditions';

export type SheetMap = Record<SheetType, StyleRule>;

export interface SheetManager {
  sheets: SheetMap;
  insertRule: (type: SheetType, rule: CSS, index?: number) => number;
}

// VENDOR PREFIXES

export interface VendorPrefixer {
  prefix: (property: string, value: string) => Record<string, string>;
  prefixSelector: (selector: string, rule: CSS) => CSS;
}

// STYLE ENGINE

export interface EngineOptions {
  cacheManager: CacheManager;
  direction?: Direction;
  directionConverter?: DirectionConverter | null;
  ruleIndex?: number;
  sheetManager: SheetManager;
  unitSuffixer?: UnitFactory;
  vendorPrefixer?: VendorPrefixer | null;
}

export interface Engine {
  renderDeclaration: <K extends Property>(
    property: K,
    value: NonNullable<Properties[K]> | ValueWithFallbacks,
    options?: RenderOptions,
  ) => ClassName;
  renderFontFace: (fontFace: FontFace, options?: RenderOptions) => string;
  renderImport: (path: string, options?: RenderOptions) => void;
  renderKeyframes: (
    keyframes: Keyframes,
    animationName?: string,
    options?: RenderOptions,
  ) => string;
  renderRule: (rule: Rule, options?: RenderOptions) => ClassName;
  renderVariable: (name: string, value: Value, options?: RenderOptions) => ClassName;
}
