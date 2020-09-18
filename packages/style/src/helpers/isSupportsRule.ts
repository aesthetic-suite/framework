const SUPPORTS = /^@supports(\s+|\()/u;

export default function isSupportsRule(value: string): boolean {
  // https://jsperf.com/string-startswith/66
  return SUPPORTS.test(value);
}
