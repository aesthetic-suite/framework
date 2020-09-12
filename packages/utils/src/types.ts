export type StringKey<T> = T extends string ? T : string;

export type LiteralUnion<T extends string> = T | (string & {});
