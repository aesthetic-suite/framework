import {
  CSS,
  ClassName,
  Unit,
  UnitFactory,
  Variables,
  GenericProperties,
  Value,
} from '@aesthetic/types';

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
  vendor?: VendorPrefixerAPI | null;
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

// ADDONS

export interface VendorPrefixerAPI {
  prefixDeclaration: (props: GenericProperties, key: string, value: Value) => void;
  prefixSelector: (selector: string, rule: CSS) => CSS;
}
