import type { StyleDeclarations } from '../src/types';

declare module 'jss' {
  declare export type StyleSheetOptions = {
    element?: Object,
    index?: number,
    media?: string,
    meta?: string,
    named?: boolean,
    virtual?: boolean,
  };

  declare export class StyleSheet {
    classes: { [key: string]: string };
    attach(): this;
    detach(): this;
  }

  declare export default class Jss {
    constructor(options?: Object): void;
    createStyleSheet(rules: StyleDeclarations, options?: StyleSheetOptions): StyleSheet;
  }

  declare export function create(options?: Object): Jss;
}
