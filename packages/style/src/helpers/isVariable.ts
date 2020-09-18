const VAR = /^--[a-z]+/u;

export default function isVariable(value: string): boolean {
  // https://jsperf.com/string-startswith/66
  return VAR.test(value);
}
