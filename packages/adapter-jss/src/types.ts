import { ClassName } from 'aesthetic';
import { SimpleStyle } from 'jss/css'; // eslint-disable-line import/no-unresolved

export type NativeBlock = SimpleStyle & {
  fallbacks?: any;
};

export type ParsedBlock = ClassName;
