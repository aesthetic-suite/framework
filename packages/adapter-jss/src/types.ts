import { ClassName } from 'aesthetic';
import { JssStyle } from 'jss';

export type NativeBlock = JssStyle & {
  fallbacks?: unknown;
};

export type ParsedBlock = ClassName;
