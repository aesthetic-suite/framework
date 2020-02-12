declare module 'css-in-js-utils' {
  export function cssifyDeclaration(prop: string, value: unknown): string;
  export function hyphenateProperty(prop: string): string;
  export function isUnitlessProperty(prop: string): boolean;
}
