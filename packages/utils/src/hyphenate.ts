const PATTERN = /[A-Z]/gu;
const cache: { [key: string]: string } = {};

function toLower(match: string): string {
  return `-${match.toLocaleLowerCase()}`;
}

export default function hyphenate(value: string): string {
  if (!cache[value]) {
    cache[value] = value.replace(PATTERN, toLower);
  }

  return cache[value];
}
