import { ClassName } from 'aesthetic';
import { SimpleStyle } from 'jss/css'; // eslint-disable-line import/no-unresolved

export type NativeBlock = SimpleStyle & {
  fallbacks?: unknown;
};

export type ParsedBlock = ClassName;
