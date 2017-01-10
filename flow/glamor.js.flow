import type { CSSStyle } from '../src/types';

declare module 'glamor' {
  declare type SheetDeclaration = {
    [key: string]: string,
    toString(): string,
  };

  declare export function fontFace(rule: CSSStyle): string;

  declare export function keyframes(name?: string, rule: CSSStyle): string;

  declare export var css: {
    fontFace: fontFace,
    keyframes: keyframes,
    (...rules: CSSStyle[]): SheetDeclaration,
  };
}
