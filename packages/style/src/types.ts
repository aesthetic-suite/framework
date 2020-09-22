import {
  ClassName,
  CSS,
  Direction,
  GenericProperties,
  Unit,
  UnitFactory,
  Value,
  Variables,
} from '@aesthetic/types';

export type SheetType = 'global' | 'standard' | 'conditions';

export interface Condition {
  query: string;
  type: number;
}

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

export interface CacheItem extends Omit<RenderOptions, keyof ProcessOptions> {
  rank: number;
}

export interface StyleRule {
  conditionText?: string;
  cssRules: StyleRule[];
  cssText: CSS;
  cssVariables: Variables<string>;
  lastIndex?: number;
  textContent: CSS;
  type: number;
  insertRule: (rule: CSS, index: number) => number;
}

// ADDONS

export interface DirectionConverter {
  convert: <T extends Value>(
    from: Direction,
    to: Direction,
    key: string,
    value: T,
  ) => { key: string; value: T };
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
