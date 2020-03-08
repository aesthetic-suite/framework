const PATTERN = /^--[a-z]+/u;

export default function isCssVariable(value: string): boolean {
  // https://jsperf.com/string-startswith/66
  return PATTERN.test(value);
}
