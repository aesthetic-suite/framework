import {
  ClassName,
  CSS,
  Direction,
  GenericProperties,
  Properties,
  Property,
  Unit,
  UnitFactory,
  Value,
  Variables,
} from '@aesthetic/types';

export type SheetType = 'global' | 'standard' | 'conditions';

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
  conditions?: Condition[] | string;
  // minimumRank?: number;
  selector?: string;
}

export interface CacheItem {
  className: string;
  rank?: number;
}

export interface StyleRule {
  conditionText?: string;
  cssRules: StyleRule[];
  cssText: CSS;
  cssVariables: Variables<string>;
  textContent: CSS;
  type: number;
  insertRule: (rule: CSS, index: number) => number;
}

// ADDONS

export interface CacheManager {
  read: (key: string, minimumRank?: number) => CacheItem | null;
  write: (key: string, item: CacheItem) => void;
}

export interface DirectionConverter {
  convert: <T extends Value>(
    from: Direction,
    to: Direction,
    property: string,
    value: T,
  ) => { property: string; value: T };
}

export interface SheetManager {
  insertRule: (type: SheetType, rule: CSS, index?: number) => number;
}

export interface VendorPrefixer {
  prefix: (key: string, value: Value) => GenericProperties;
  prefixSelector: (selector: string, rule: CSS) => CSS;
}

export interface API {
  converter?: DirectionConverter | null;
  direction: Direction;
  prefixer?: VendorPrefixer | null;
}

export interface EngineOptions {
  cacheManager: CacheManager;
  direction: Direction;
  directionConverter?: DirectionConverter | null;
  sheetManager: SheetManager;
  vendorPrefixer?: VendorPrefixer | null;
}

export interface Engine {
  renderDeclaration: <K extends Property>(
    property: K,
    value: Properties[K],
    options?: RenderOptions,
  ) => ClassName;
}
