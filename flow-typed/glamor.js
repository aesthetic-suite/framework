import type { StyleDeclaration } from '../src/types';

declare module 'glamor' {
  declare type SheetDeclaration = {
    [key: string]: string,
    toString(): string,
  };

  declare export function fontFace(rule: StyleDeclaration): string;

  declare export function keyframes(name?: string, rule: StyleDeclaration): string;

  declare export var css: {
    fontFace: fontFace,
    keyframes: keyframes,
    (...rules: StyleDeclaration[]): SheetDeclaration,
  };
}
