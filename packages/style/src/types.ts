import CSS from 'csstype';

export type ClassName = string;

export type Value = string | number;

export type BaseProperties = CSS.Properties<Value> & CSS.PropertiesHyphen<Value>;

export interface Properties extends BaseProperties {
  [key: string]: BaseProperties | undefined | unknown;
}

export type Property = keyof BaseProperties;

export type FontFace = Omit<CSS.FontFace, 'fontFamily'> & { fontFamily: string };

export interface Keyframes {
  [percent: string]: Properties | undefined;
  from?: Properties;
  to?: Properties;
}

export type SheetType = 'global' | 'low-pri' | 'high-pri';

export interface CacheItem {
  className: string;
  condition: string;
  rank: number;
  selector: string;
  type: SheetType;
}

export interface StyleParams {
  condition?: string;
  selector?: string;
  type?: SheetType;
}
