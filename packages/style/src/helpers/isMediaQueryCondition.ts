const PATTERN = /^@media(\s+|\()/u;

export default function isMediaQueryCondition(value: string): boolean {
  // https://jsperf.com/string-startswith/66
  return PATTERN.test(value);
}
