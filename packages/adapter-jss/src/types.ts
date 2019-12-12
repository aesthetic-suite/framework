import { ClassName } from 'aesthetic';
import { Style } from 'jss';

export type NativeBlock = Style & {
  fallbacks?: unknown;
};

export type ParsedBlock = ClassName;
