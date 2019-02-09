import { CSSProperties } from 'aphrodite';

export type NativeBlock = CSSProperties;

export interface ParsedBlock {
  _len: number;
  _name: string;
  _definition: NativeBlock;
}
