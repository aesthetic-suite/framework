export type StringKey<T> = T extends string ? T : string;

export type StringOnly<T> = T extends string ? string : never;

export type LiteralUnion<T extends string> = T | (string & {});
