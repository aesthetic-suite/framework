import CSS from 'csstype';

export type ClassName = string;

export type Properties = CSS.Properties & CSS.PropertiesHyphen;

export type Property = keyof Properties;

export type Value = string | number;

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
