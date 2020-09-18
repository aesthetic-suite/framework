export type PrefixMap = Record<string, number>;

export type DeclarationPrefixMap = Record<
  string,
  {
    prefixes?: number;
    functions?: PrefixMap;
    values?: PrefixMap;
  }
>;
