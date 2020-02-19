const PATTERN = /^@import\s+/u;

export default function isImportRule(value: string): boolean {
  // https://jsperf.com/string-startswith/66
  return PATTERN.test(value);
}
