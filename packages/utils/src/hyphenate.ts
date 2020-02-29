const CAMEL_CASE_PATTERN = /[A-Z]/gu;
const VENDOR_PREFIX_PATTERN = /^(ms|moz|webkit)/u;
const cache: { [key: string]: string } = {};

function toLower(match: string): string {
  return `-${match.toLocaleLowerCase()}`;
}

export default function hyphenate(value: string): string {
  if (!cache[value]) {
    let result = value.replace(CAMEL_CASE_PATTERN, toLower);

    if (VENDOR_PREFIX_PATTERN.test(result)) {
      result = `-${result}`;
    }

    cache[value] = result;
  }

  return cache[value];
}
