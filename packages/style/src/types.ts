import {
  CSS,
  Declarations,
  Value,
  ClassName,
  Unit,
  UnitFactory,
  Variables,
} from '@aesthetic/types';

export interface Rule extends Declarations {
  [key: string]: Rule | Value | unknown;
}

export type SheetType = 'global' | 'standard' | 'conditions';

export interface Condition {
  query: string;
  type: number;
}

export interface RankCache {
  [property: string]: number;
}

export interface ProcessOptions {
  deterministic?: boolean;
  rankings?: RankCache;
  rtl?: boolean;
  unit?: Unit | UnitFactory;
  vendor?: boolean;
}

export interface RenderOptions extends ProcessOptions {
  className?: ClassName;
  conditions?: Condition[];
  selector?: string;
  type?: SheetType;
}

export interface CacheItem extends Required<Omit<RenderOptions, keyof ProcessOptions>> {
  rank: number;
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

// DATA

export interface PrefixMap {
  [value: string]: number;
}

export interface DeclarationPrefixMap {
  [property: string]: {
    prefixes?: number;
    functions?: PrefixMap;
    values?: PrefixMap;
  };
}
